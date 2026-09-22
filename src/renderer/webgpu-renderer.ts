import { Config } from "../util/config.ts";
import { RenderConfig } from "./render-config.ts";
import { Stage } from "../core/stage.ts";
import { Actor } from "../core/actor.ts";
import { AttachmentLayout } from "./attachment-layout.ts";
import { UnlitMaterial } from "../materials/unlit.ts";
import { InstanceManager } from "./instance-manager.ts";
import { WebGpuTextureLoader } from "../loaders/texture/webgpu-texture-loader.ts";
import { UnlitPipelineArgs, UnlitPipelineFactory } from "./pipelines/unlit.ts";
import { DecalManager } from "./decal-manager.ts";
import { SelectionManager } from "./selection-manager.ts";
import { PBRPipelineArgs, PBRPipelineFactory } from "./pipelines/pbr.ts";
import { PBRMaterial } from "../materials/pbr.ts";
import { CameraManager } from "./camera-manager.ts";
import { ClusterManager } from "./cluster-manager.ts";
import { QueryArgs } from "../util/query-args.ts";

export interface WebGPURendererOptions {
  canvas?: HTMLCanvasElement;
  depthStencilFormat?: GPUTextureFormat;
  depthStencilUsage?: GPUTextureUsageFlags;
  sampleCount?: number;
}

export class WebGPURenderer {
  static RequiredFeatures: GPUFeatureName[] = [];
  static OptionalFeatures: GPUFeatureName[] = [
    // @ts-expect-error Not an official part of the spec
    'chromium-experimental-sampling-resource-table',
  ];

  device: GPUDevice;
  canvas: HTMLCanvasElement;
  context: GPUCanvasContext;

  config: RenderConfig;
  supportsBindless: boolean;

  textureLoader: WebGpuTextureLoader;

  depthStencilTexture?: GPUTexture;
  msaaColorTexture?: GPUTexture;

  attachmentLayout: AttachmentLayout;

  frameBGL: GPUBindGroupLayout;
  #frameBindGroup?: GPUBindGroup;

  cameraManager: CameraManager;
  clusterManager: ClusterManager;
  instanceManager: InstanceManager;
  decalManager: DecalManager;
  selectionManager: SelectionManager;

  unlitPipelineFactory: UnlitPipelineFactory;
  pbrPipelineFactory: PBRPipelineFactory;

  defaultSampler: GPUSampler;

  whiteTexture: GPUTexture;
  blackTexture: GPUTexture;
  normalTexture: GPUTexture;
  whiteCubeTexture: GPUTexture;

  #environmentTexture?: GPUTexture;

  causticsTexture?: GPUTexture;

  constructor(device: GPUDevice, options: WebGPURendererOptions) {
    this.device = device;
    this.canvas = options.canvas ?? document.createElement('canvas');
    this.context = this.canvas.getContext("webgpu") as GPUCanvasContext;

    this.config = Config.Create(RenderConfig, device);

    this.supportsBindless = QueryArgs.getBool('bindless', false) && this.device.features.has('chromium-experimental-sampling-resource-table');

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
    this.whiteCubeTexture = this.device.createTexture({
      label: 'Temp Environment',
      size: [1, 1, 6],
      format: 'rgba8unorm',
      usage: GPUTextureUsage.TEXTURE_BINDING,
    });

    this.attachmentLayout = new AttachmentLayout(
      [this.config.colorFormat, this.config.selectionFormat],
      this.config.depthStencilFormat,
      this.config.sampleCount
    );

    this.frameBGL = device.createBindGroupLayout({
      label: 'Frame',
      entries: [{
        // Camera Uniforms
        binding: 0,
        visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT | GPUShaderStage.COMPUTE,
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
      }, {
        // Cluster Bounds
        binding: 8,
        visibility: GPUShaderStage.FRAGMENT,
        buffer: { type: 'read-only-storage' }
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

    this.cameraManager = new CameraManager(this);
    this.clusterManager = new ClusterManager(this);
    this.instanceManager = new InstanceManager(this);
    this.decalManager = new DecalManager(this);
    this.selectionManager = new SelectionManager(this);

    this.unlitPipelineFactory = new UnlitPipelineFactory(this);
    this.pbrPipelineFactory = new PBRPipelineFactory(this);
  }

  get environmentTexture(): GPUTexture | undefined {
    return this.#environmentTexture;
  }

  set environmentTexture(value: GPUTexture | undefined) {
    this.#environmentTexture = value;
    this.frameBindingsDirty();
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
  get frameBindings(): GPUBindGroup {
    if (this.#rebuildFrameBindings) {
      this.#rebuildFrameBindings = false;

      this.#frameBindGroup = this.device.createBindGroup({
        label: 'Frame',
        layout: this.frameBGL,
        entries: [{
          binding: 0,
          resource: this.cameraManager.cameraBuffer,
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
          resource: (this.environmentTexture ? this.environmentTexture : this.whiteCubeTexture).createView({dimension: 'cube'}),
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
        }, {
          binding: 8,
          resource: this.clusterManager.clusterBoundsBuffer,
        }]
      });
    }
    return this.#frameBindGroup!;
  }

  render(stage: Stage, cameraActor: Actor, timestamp: number = performance.now()) {
    this.cameraManager.updateCamera(cameraActor, timestamp);
    this.instanceManager.updateInstances(stage);
    this.decalManager.updateDecals(stage);

    if (this.instanceManager.instanceCount == 0) { return; }

    const colorTexture = this.context.getCurrentTexture();

    const commandEncoder = this.device.createCommandEncoder();

    // Should only need to be done when the camera properties change or the screen resizes.
    this.clusterManager.updateClusterBounds(commandEncoder);

    const passDesc: GPURenderPassDescriptor = {
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
    };

    if (this.supportsBindless) {
      // @ts-expect-error
      passDesc.resourceTable = this.decalManager.decalResourceTable;
    }

    const renderPass = commandEncoder.beginRenderPass(passDesc);

    renderPass.setBindGroup(0, this.frameBindings);

    // Loop through the gathered instances and render
    // TODO: Materials and Pipelines need to be handled way better here.
    for (let materialGeometries of this.instanceManager.materials.values()) {
      if (materialGeometries.material instanceof UnlitMaterial) {
        renderPass.setBindGroup(1, (materialGeometries.material as UnlitMaterial).materialBindGroup);

        for (let geometryInstances of materialGeometries.geometries.values()) {
          const args: UnlitPipelineArgs = {
            canDecal: materialGeometries.material.canDecal,
            depthTest: materialGeometries.material.depthTest,
            doubleSided: materialGeometries.material.doubleSided,
            transparent: materialGeometries.material.transparent,
            mirrored: false,
            useBindless: this.supportsBindless,
          };
          if (geometryInstances.instances.length) {
            const pipeline = this.unlitPipelineFactory.getPipeline(
              geometryInstances.geometry.layout, this.attachmentLayout, args);
            pipeline.use(renderPass);
            geometryInstances.geometry.bindAndDraw(renderPass, geometryInstances.instanceCount, geometryInstances.indexOffset);
          }
          if (geometryInstances.mirroredInstances.length) {
            args.mirrored = true;
            const pipeline = this.unlitPipelineFactory.getPipeline(
              geometryInstances.geometry.layout, this.attachmentLayout, args);
            pipeline.use(renderPass);
            geometryInstances.geometry.bindAndDraw(renderPass, geometryInstances.mirroredInstanceCount, geometryInstances.mirroredIndexOffset);
          }
        }
      } else if (materialGeometries.material instanceof PBRMaterial) {
        renderPass.setBindGroup(1, (materialGeometries.material as PBRMaterial).materialBindGroup);

        for (let geometryInstances of materialGeometries.geometries.values()) {
          const args: PBRPipelineArgs = {
            doubleSided: materialGeometries.material.doubleSided,
            transparent: materialGeometries.material.transparent,
            mirrored: false,
          };

          if (geometryInstances.instances.length) {
            const pipeline = this.pbrPipelineFactory.getPipeline(
              geometryInstances.geometry.layout, this.attachmentLayout, args);
            pipeline.use(renderPass);
            geometryInstances.geometry.bindAndDraw(renderPass, geometryInstances.instanceCount, geometryInstances.indexOffset);
          }
          if (geometryInstances.mirroredInstances.length) {
            args.mirrored = true;
            const pipeline = this.pbrPipelineFactory.getPipeline(
              geometryInstances.geometry.layout, this.attachmentLayout, args);
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
