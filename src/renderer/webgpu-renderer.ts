import { Mat4, Vec3 } from "gl-matrix";
import { Config } from "../util/config.ts";
import { RenderConfig } from "./render-config.ts";
import { Stage } from "../core/stage.ts";
import { Actor } from "../core/actor.ts";
import { AttachmentLayout } from "./attachment-layout.ts";
import { UnlitMaterial } from "../materials/unlit.ts";
import { InstanceManager } from "./instance-manager.ts";
import { WebGpuTextureLoader } from "../loaders/texture/webgpu-texture-loader.ts";
import { OrthographicCamera, PerspectiveCamera } from "../core/camera.ts";
import { UnlitPipelineFactory } from "./pipelines/unlit.ts";
import { DecalManager } from "./decal-manager.ts";
import { SelectionManager } from "./selection-manager.ts";
import { PBRPipelineFactory } from "./pipelines/pbr.ts";
import { PBRMaterial } from "../materials/pbr.ts";

export interface WebGPURendererOptions {
  canvas?: HTMLCanvasElement;
  depthStencilFormat?: GPUTextureFormat;
  depthStencilUsage?: GPUTextureUsageFlags;
  sampleCount?: number;
}

export class WebGPURenderer {
  device: GPUDevice;
  canvas: HTMLCanvasElement;
  context: GPUCanvasContext;

  config: RenderConfig;

  textureLoader: WebGpuTextureLoader;

  depthStencilTexture?: GPUTexture;
  msaaColorTexture?: GPUTexture;

  attachmentLayout: AttachmentLayout;

  #cameraArray = new Float32Array(16*3 + 4);
  #projMat = new Mat4(this.#cameraArray.buffer, 0);
  #inverseProjMat = new Mat4(this.#cameraArray.buffer, Mat4.BYTE_LENGTH);
  #viewMat = new Mat4(this.#cameraArray.buffer, Mat4.BYTE_LENGTH * 2);
  #viewPos = new Vec3(this.#cameraArray.buffer, Mat4.BYTE_LENGTH * 3);

  frameBGL: GPUBindGroupLayout;
  frameBindGroup?: GPUBindGroup;
  cameraBuffer: GPUBuffer;

  instanceManager: InstanceManager;

  decalManager: DecalManager;
  selectionManager: SelectionManager;

  unlitPipelineFactory: UnlitPipelineFactory;
  pbrPipelineFactory: PBRPipelineFactory;

  defaultSampler: GPUSampler;

  whiteTexture: GPUTexture;
  blackTexture: GPUTexture;
  normalTexture: GPUTexture;

  environmentTexture: GPUTexture;

  causticsTexture?: GPUTexture;

  constructor(device: GPUDevice, options: WebGPURendererOptions) {
    this.device = device;
    this.canvas = options.canvas ?? document.createElement('canvas');
    this.context = this.canvas.getContext("webgpu") as GPUCanvasContext;

    this.config = Config.Create(RenderConfig, device);

    // Set up the canvas context
    this.context.configure({
      device: this.device,
      format: this.config.colorFormat,
    });

    this.textureLoader = new WebGpuTextureLoader(device);
    this.whiteTexture = this.textureLoader.fromColor(1, 1, 1, 1);
    this.blackTexture = this.textureLoader.fromColor(0, 0, 0, 0);
    this.normalTexture = this.textureLoader.fromColor(0.5, 0.5, 1, 1);

    this.textureLoader.fromUrl('./media/textures/caustics.jpg').then((texture: GPUTexture) => {
      this.causticsTexture = texture;
      this.frameBindingsDirty();
    });

    // Temporarily bind a black cube map for the environment.
    // TODO: Should make it white later.
    this.environmentTexture = this.device.createTexture({
      label: 'Temp Environment',
      size: [1, 1, 6],
      format: 'rgba8unorm',
      usage: GPUTextureUsage.TEXTURE_BINDING,
    });
    this.textureLoader.fromUrl('./media/environment/industrial_pipe_and_valve_ibl.ktx').then((texture: GPUTexture) => {
      this.environmentTexture = texture;
      this.frameBindingsDirty();
    });

    this.attachmentLayout = new AttachmentLayout(
      [this.config.colorFormat, this.config.selectionFormat],
      this.config.depthStencilFormat,
      this.config.sampleCount
    );

    this.cameraBuffer = device.createBuffer({
      label: 'Camera',
      size: this.#cameraArray.byteLength,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    });

    this.frameBGL = device.createBindGroupLayout({
      label: 'Frame',
      entries: [{
        // Camera Uniforms
        binding: 0,
        visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
        buffer: {}
      }, {
        // Instance Data
        binding: 1,
        visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT | GPUShaderStage.COMPUTE,
        buffer: { type: 'read-only-storage' }
      }, {
        // Instance Index
        binding: 2,
        visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT | GPUShaderStage.COMPUTE,
        buffer: { type: 'read-only-storage' }
      }, {
        // Default Sampler
        binding: 3,
        visibility: GPUShaderStage.FRAGMENT,
        sampler: {}
      }, {
        // Environment Texture
        binding: 4,
        visibility: GPUShaderStage.FRAGMENT,
        texture: { viewDimension: 'cube' }
      }, {
        // Decal Data
        binding: 5,
        visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
        buffer: { type: 'read-only-storage' }
      }, {
        // Decal Array Texture
        binding: 6,
        visibility: GPUShaderStage.FRAGMENT,
        texture: { viewDimension: '2d-array' }
      }, {
        // Caustics Texture
        binding: 7,
        visibility: GPUShaderStage.FRAGMENT,
        texture: {}
      }]
    });

    this.defaultSampler = device.createSampler({
      label: 'Default',
      addressModeU: 'repeat',
      addressModeV: 'repeat',
      minFilter: 'linear',
      magFilter: 'linear',
      mipmapFilter: 'linear',
    });

    this.decalManager = new DecalManager(this);
    this.selectionManager = new SelectionManager(this);

    this.instanceManager = new InstanceManager(this);

    this.unlitPipelineFactory = new UnlitPipelineFactory(this);
    this.pbrPipelineFactory = new PBRPipelineFactory(this);
  }

  onResize(width: number, height: number) {
    width = Math.floor(width * this.config.outputScale);
    height = Math.floor(height * this.config.outputScale);

    // Resize the output canvas.
    this.canvas.width = width;
    this.canvas.height = height;

    // Resize the depthStencil texture.
    if (this.depthStencilTexture) {
      this.depthStencilTexture.destroy();
    }

    this.depthStencilTexture = this.device.createTexture({
      label: 'WebGPURenderer depthStencil',
      size: { width, height },
      sampleCount: this.config.sampleCount,
      format: this.config.depthStencilFormat,
      usage: GPUTextureUsage.RENDER_ATTACHMENT,
    });

    // Resize the MSAA color texture if needed.
    if (this.config.sampleCount > 1) {
      if (this.msaaColorTexture) {
        this.msaaColorTexture.destroy();
      }

      this.msaaColorTexture = this.device.createTexture({
        label: 'WebGPURenderer msaaColor',
        size: { width, height },
        sampleCount: this.config.sampleCount,
        format: this.config.colorFormat,
        usage: GPUTextureUsage.RENDER_ATTACHMENT,
      });
    }

    this.selectionManager.onResize(width, height);
  }

  #rebuildFrameBindings = true;
  frameBindingsDirty() {
    this.#rebuildFrameBindings = true;
  }
  ensureFrameBindings(): GPUBindGroup {
    if (this.#rebuildFrameBindings) {
      this.#rebuildFrameBindings = false;

      this.frameBindGroup = this.device.createBindGroup({
        label: 'Frame',
        layout: this.frameBGL,
        entries: [{
          binding: 0,
          resource: this.cameraBuffer,
        }, {
          binding: 1,
          resource: this.instanceManager.instanceBuffers!.instanceTransformBuffer,
        }, {
          binding: 2,
          resource: this.instanceManager.instanceBuffers!.instanceIndexBuffer,
        }, {
          binding: 3,
          resource: this.defaultSampler,
        }, {
          binding: 4,
          resource: this.environmentTexture.createView({dimension: 'cube'}),
        }, {
          binding: 5,
          resource: this.decalManager.decalBuffer,
        }, {
          binding: 6,
          resource: this.decalManager.decalTextureArray.createView({
            label: 'Decal',
            dimension: '2d-array'
          }),
        }, {
          binding: 7,
          resource: this.causticsTexture ?? this.whiteTexture,
        }]
      });
    }
    return this.frameBindGroup!;
  }

  updateCamera(cameraActor: Actor, timestamp: number) {
    const camera = cameraActor.get(PerspectiveCamera) ?? cameraActor.get(OrthographicCamera);
    if (!camera) {
      throw new Error('cameraActor passed to WebGPURenderer.render() must have a camera component');
    }

    // Update the various camera matrices.
    camera.getProjection(this.#projMat);
    Mat4.invert(this.#inverseProjMat, this.#projMat);
    Mat4.invert(this.#viewMat, cameraActor.worldTransform.matrix);
    this.#viewPos.set(cameraActor.worldTransform.translation);
    this.#cameraArray[51] = timestamp / 1000;

    // Update camera uniforms
    this.device.queue.writeBuffer(this.cameraBuffer, 0, this.#cameraArray);
  }

  render(stage: Stage, cameraActor: Actor, timestamp: number = performance.now()) {
    this.updateCamera(cameraActor, timestamp);
    this.instanceManager.updateInstances(stage);
    this.decalManager.updateDecals(stage);

    if (this.instanceManager.instanceCount == 0) { return; }

    const colorTexture = this.context.getCurrentTexture();

    const commandEncoder = this.device.createCommandEncoder();
    const renderPass = commandEncoder.beginRenderPass({
      colorAttachments: [{
        view: colorTexture,
        loadOp: 'clear',
        clearValue: [0.1, 0.1, 0.2, 1],
        storeOp: 'store',
      }, {
        view: this.selectionManager.selectionTexture!,
        loadOp: 'clear',
        clearValue: [0, 0, 0, 0],
        storeOp: 'store',
      }],
      depthStencilAttachment: {
        view: this.depthStencilTexture!,
        depthLoadOp: 'clear',
        depthClearValue: 0,
        depthStoreOp: 'discard',
      }
    });

    renderPass.setBindGroup(0, this.ensureFrameBindings());

    // Loop through the gathered instances and render
    // TODO: Materials and Pipelines need to be handled way better here.
    for (let materialGeometries of this.instanceManager.materials.values()) {
      if (materialGeometries.material instanceof UnlitMaterial) {
        renderPass.setBindGroup(1, (materialGeometries.material as UnlitMaterial).materialBindGroup);

        for (let geometryInstances of materialGeometries.geometries.values()) {
          if (geometryInstances.instances.length) {
            const pipeline = this.unlitPipelineFactory.getPipeline(
              geometryInstances.geometry.layout, this.attachmentLayout,
              { ...materialGeometries.material as UnlitMaterial, mirrored: false });
            pipeline.use(renderPass);
            geometryInstances.geometry.bindAndDraw(renderPass, geometryInstances.instanceCount, geometryInstances.indexOffset);
          }
          if (geometryInstances.mirroredInstances.length) {
            const pipeline = this.unlitPipelineFactory.getPipeline(
              geometryInstances.geometry.layout, this.attachmentLayout,
              { ...materialGeometries.material as UnlitMaterial, mirrored: true });
            pipeline.use(renderPass);
            geometryInstances.geometry.bindAndDraw(renderPass, geometryInstances.mirroredInstanceCount, geometryInstances.mirroredIndexOffset);
          }
        }
      } else if (materialGeometries.material instanceof PBRMaterial) {
        renderPass.setBindGroup(1, (materialGeometries.material as PBRMaterial).materialBindGroup);

        for (let geometryInstances of materialGeometries.geometries.values()) {
          if (geometryInstances.instances.length) {
            const pipeline = this.pbrPipelineFactory.getPipeline(
              geometryInstances.geometry.layout, this.attachmentLayout,
              { ...materialGeometries.material as PBRMaterial, mirrored: false });
            pipeline.use(renderPass);
            geometryInstances.geometry.bindAndDraw(renderPass, geometryInstances.instanceCount, geometryInstances.indexOffset);
          }
          if (geometryInstances.mirroredInstances.length) {
            const pipeline = this.pbrPipelineFactory.getPipeline(
              geometryInstances.geometry.layout, this.attachmentLayout,
              { ...materialGeometries.material as PBRMaterial, mirrored: true });
            pipeline.use(renderPass);
            geometryInstances.geometry.bindAndDraw(renderPass, geometryInstances.mirroredInstanceCount, geometryInstances.mirroredIndexOffset);
          }
        }
      }
    }

    renderPass.end();
    this.device.queue.submit([commandEncoder.finish()]);
  }
}

/**
 * A simple resize observer implementation that returns the most pixel-accurate width and height of
 * an element available for the given browser.
 */
type ResizeCallback = (width: number, height: number, element?: Element) => void;
export class ResizeHandler {
  static #observer: ResizeObserver;
  static #elementCallbacks: WeakMap<Element, ResizeCallback>;

  static observe(element: Element, callback: ResizeCallback) {
    if (!this.#observer) {
      this.#elementCallbacks = new WeakMap();
      this.#observer = new ResizeObserver((entries) => {
        for (let entry of entries) {
          const element = entry.target;
          const callback = this.#elementCallbacks.get(element);
          if (!callback) {
            continue;
          }

          // devicePixelContentBoxSize is supported in Chrome and Firefox
          if (entry.devicePixelContentBoxSize) {
            callback(
              entry.devicePixelContentBoxSize[0].inlineSize,
              entry.devicePixelContentBoxSize[0].blockSize,
              element,
            );
          } else {
            // These values not correct but they're as close as you can get in Safari
            callback(
              entry.contentBoxSize[0].inlineSize * devicePixelRatio,
              entry.contentBoxSize[0].blockSize * devicePixelRatio,
              element,
            );
          }
        }
      });
    }

    // Ensure that the callback gets called at least once with a reasonable estimate of the pixel size.
    if (element.clientWidth != 0 && element.clientHeight != 0) {
      callback(
        Math.floor(element.clientWidth * devicePixelRatio),
        Math.floor(element.clientHeight * devicePixelRatio),
        element,
      );
    }

    this.#elementCallbacks.set(element, callback);
    this.#observer.observe(element);
  }

  static unobserve(element: Element) {
    this.#observer?.unobserve(element);
    this.#elementCallbacks?.delete(element);
  }
}

export interface WebGPUAppCallbacks {
  onInit(gpu: WebGPURenderer): void;
  onResize(gpu: WebGPURenderer, width: number, height: number): void;
  onFrame(gpu: WebGPURenderer, timestamp: number, delta: number): void;
}

export class WebGPUApp implements WebGPUAppCallbacks {
  static async Begin<AppType extends WebGPUAppCallbacks>(appType: new(gpu: WebGPURenderer) => AppType, options: WebGPURendererOptions = {}) {
    // Create the WebGPU device
    const adapter = await navigator.gpu?.requestAdapter();
    const device = await adapter?.requestDevice();
    if (!device) {
      console.log("Unable to create WebGPU device.");
      return;
    }

    const gpu = new WebGPURenderer(device, options);

    const app = new appType(gpu);

    await app.onInit(gpu);

    // Start listening for resize events
    ResizeHandler.observe(gpu.canvas, (width, height) => {
      gpu.onResize(width, height);
      app.onResize(gpu, width, height);
    });

    // Start the render loop
    let lastFrame = performance.now();
    const rafCallback = (timestamp: number) => {
      // Always queue up another frame
      requestAnimationFrame(rafCallback);

      // Figure out the delta from the last frame.
      const delta = timestamp - lastFrame;
      lastFrame = timestamp;
      // Skip long frames because they likely mean that the user switched away from the tab for a while.
      if (delta > 1000) {
        return;
      }

      app.onFrame(gpu, timestamp, delta);
    };
    requestAnimationFrame(rafCallback);
  }

  constructor(public gpu: WebGPURenderer) {}

  async onInit(gpu: WebGPURenderer) {}

  onResize(gpu: WebGPURenderer, width: number, height: number) {
  }

  onFrame(gpu: WebGPURenderer, timestamp: number, delta: number) {}
}