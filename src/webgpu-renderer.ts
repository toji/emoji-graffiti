import { Mat4 } from "gl-matrix";
import { Config } from "./common/config.ts";
import { Stage } from "./common/stage.ts";
import { AttachmentLayout } from "./common/webgpu/attachment-layout.ts";
import { RendererConfig } from "./config/renderer.ts";
import { OrbitCamera } from "./common/webgpu/camera/orbit-camera.ts";
import { UnlitMaterial, UnlitPipelineFactory } from "./common/webgpu/materials/unlit.ts";
import { RenderPipeline } from "./common/webgpu/pipeline-factory.ts";
import { Geometry } from "./common/webgpu/geometry.ts";
import { Actor } from "./common/actor.ts";
import { InstanceManager } from "./instance-manager.ts";
import { WebGpuTextureLoader } from "./loaders/texture/webgpu-texture-loader.ts";

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

  config: RendererConfig;

  textureLoader: WebGpuTextureLoader;

  depthStencilTexture?: GPUTexture;
  msaaColorTexture?: GPUTexture;

  attachmentLayout: AttachmentLayout;

  projection = new Mat4();
  cameraBGL: GPUBindGroupLayout;
  cameraBuffer: GPUBuffer;
  cameraBindGroup: GPUBindGroup;

  instanceBGL: GPUBindGroupLayout;
  instanceManager: InstanceManager;

  unlitPipelineFactory: UnlitPipelineFactory;
  //unlitPipeline: RenderPipeline;

  defaultSampler: GPUSampler;

  whiteTexture: GPUTexture;

  constructor(device: GPUDevice, options: WebGPURendererOptions) {
    this.device = device;
    this.canvas = options.canvas ?? document.createElement('canvas');
    this.context = this.canvas.getContext("webgpu") as GPUCanvasContext;

    this.config = Config.Create(RendererConfig, device);

    // Set up the canvas context
    this.context.configure({
      device: this.device,
      format: this.config.colorFormat,
    });

    this.textureLoader = new WebGpuTextureLoader(device);

    this.attachmentLayout = new AttachmentLayout(
      [this.config.colorFormat],
      this.config.depthStencilFormat,
      this.config.sampleCount
    );

    this.cameraBuffer = device.createBuffer({
      label: 'Camera',
      size: Mat4.BYTE_LENGTH * 2,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    });

    this.cameraBGL = device.createBindGroupLayout({
      label: 'Camera',
      entries: [{
        binding: 0,
        visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
        buffer: {}
      }]
    });

    this.cameraBindGroup = device.createBindGroup({
      label: 'Camera',
      layout: this.cameraBGL,
      entries: [{
        binding: 0,
        resource: this.cameraBuffer,
      }]
    });

    this.defaultSampler = device.createSampler({
      label: 'Default',
      addressModeU: 'clamp-to-edge',
      addressModeV: 'clamp-to-edge',
      minFilter: 'linear',
      magFilter: 'linear',
      mipmapFilter: 'linear',
    });

    this.whiteTexture = this.textureLoader.fromColor(1, 1, 1, 1);

    this.instanceBGL = device.createBindGroupLayout({
      label: 'Instance',
      entries: [{
        // Instance Transforms
        binding: 0,
        visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT | GPUShaderStage.COMPUTE,
        buffer: { type: 'read-only-storage' }
      }, {
        // Instance Index
        binding: 1,
        visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT | GPUShaderStage.COMPUTE,
        buffer: { type: 'read-only-storage' }
      }]
    });

    this.instanceManager = new InstanceManager(this);

    this.unlitPipelineFactory = new UnlitPipelineFactory(this, this.cameraBGL, this.instanceBGL);
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

    this.projection.perspectiveZO(Math.PI * 0.5, width/height, 0.1, 256);
  }

  gatherInstances(stage: Stage) {
    this.instanceManager.clear();
    stage.query(Geometry, UnlitMaterial).forEach((actor: Actor, geometry: Geometry, material: UnlitMaterial) => {
      // Build the buffers/bind groups neccessary for rendering any instances of the gemoetry/material combinations.
      // TODO: This sucks but I'm forcing myself to ignore that until it actually becomes a problem for the sake of getting anything else done.
      this.instanceManager.addInstance(material, geometry, actor);
    });
    this.instanceManager.updateBuffers();
  }

  render(stage: Stage, camera: OrbitCamera, timestamp: number = performance.now()) {
    this.gatherInstances(stage);

    //this.unlitPipeline = this.unlitPipelineFactory.getPipeline(boxGeometry.layout, gpu.attachmentLayout, { transparent: false });

    // Update camera uniforms
    this.device.queue.writeBuffer(this.cameraBuffer, 0, this.projection);
    this.device.queue.writeBuffer(this.cameraBuffer, Mat4.BYTE_LENGTH, camera.viewMatrix);

    const colorTexture = this.context.getCurrentTexture();

    const commandEncoder = this.device.createCommandEncoder();
    const renderPass = commandEncoder.beginRenderPass({
      colorAttachments: [{
        view: colorTexture,
        loadOp: 'clear',
        clearValue: [0, Math.sin(timestamp / 1000), 1, 1],
        storeOp: 'store',
      }],
      depthStencilAttachment: {
        view: this.depthStencilTexture!,
        depthLoadOp: 'clear',
        depthClearValue: 1,
        depthStoreOp: 'discard',
      }
    });

    renderPass.setBindGroup(0, this.cameraBindGroup);
    renderPass.setBindGroup(1, this.instanceManager.instanceBuffers!.instanceBindGroup);

    const offsetArray = new Uint32Array(1);

    // Build up the arrays that will populate the instance buffers
    for (let materialGeometries of this.instanceManager.materials.values()) {
      renderPass.setBindGroup(2, (materialGeometries.material as UnlitMaterial).materialBindGroup);

      for (let geometryInstances of materialGeometries.geometries.values()) {
        const unlitPipeline = this.unlitPipelineFactory.getPipeline(geometryInstances.geometry.layout, this.attachmentLayout, { transparent: false });
        offsetArray[0] = geometryInstances.indexOffset;
        // @ts-expect-error Till setImmediates gets rolled into the TypeScript WebGPU definitions.
        renderPass.setImmediates(0, offsetArray);
        unlitPipeline.use(renderPass);
        geometryInstances.geometry.bindAndDraw(renderPass, geometryInstances.instanceCount, geometryInstances.indexOffset);
      }
    }

    /*if (this.currentEmojiBindGroup) {
      renderPass.setBindGroup(0, this.cameraBindGroup);
      renderPass.setBindGroup(1, this.currentEmojiBindGroup);
      this.unlitPipeline.use(renderPass);

      const boxGeometry = this.box.get(Geometry)!;
      boxGeometry.bindAndDraw(renderPass);
      //renderPass.draw(6);
    }*/

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
      gpu.onResize(width, width);
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