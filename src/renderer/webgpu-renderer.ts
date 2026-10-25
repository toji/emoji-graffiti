import { Config } from "../util/config.ts";
import { RenderConfig } from "./render-config.ts";
import { Stage } from "../core/stage.ts";
import { Actor } from "../core/actor.ts";
import { AttachmentLayout } from "./attachment-layout.ts";
import { UnlitMaterial } from "../materials/unlit.ts";
import { GeometryInstances, InstanceManager } from "./instance-manager.ts";
import { WebGpuTextureLoader } from "../loaders/texture/webgpu-texture-loader.ts";
import { UnlitPipelineArgs, UnlitPipelineFactory } from "./pipelines/unlit.ts";
import { DecalManager } from "./decal-manager.ts";
import { SelectionManager } from "./selection-manager.ts";
import { PBRPipelineArgs, PBRPipelineFactory } from "./pipelines/pbr.ts";
import { PBRMaterial } from "../materials/pbr.ts";
import { CameraManager } from "./camera-manager.ts";
import { ClusterManager } from "./cluster-manager.ts";
import { TimestampHelper } from "../util/timestamp-helper.ts";
import { MaterialBase } from "../materials/material-base.ts";
import { GeometryInstancePass } from "./geometry-instance-pass.ts";

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
    'timestamp-query',
  ];

  device: GPUDevice;
  canvas: HTMLCanvasElement;
  context: GPUCanvasContext;

  config: RenderConfig;
  timestampHelper: TimestampHelper;

  textureLoader: WebGpuTextureLoader;

  depthStencilTexture?: GPUTexture;
  msaaColorTexture?: GPUTexture;

  attachmentLayout: AttachmentLayout;
  depthAttachmentLayout: AttachmentLayout;

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

  depthPrepass: GeometryInstancePass;
  forwardPass: GeometryInstancePass;

  constructor(device: GPUDevice, options: WebGPURendererOptions) {
    this.device = device;
    this.canvas = options.canvas ?? document.createElement('canvas');
    this.context = this.canvas.getContext("webgpu") as GPUCanvasContext;

    this.config = Config.Create(RenderConfig, device);

    this.timestampHelper = new TimestampHelper(device);

    if(this.config.useBindless) {
      console.log('Using Bindless for Decals! 👍');
    } else {
      console.log('Not using Bindless for Decals')
    }

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
    this.depthAttachmentLayout = new AttachmentLayout([], this.config.depthStencilFormat, this.config.sampleCount);

    const frameBGLEntries: GPUBindGroupLayoutEntry[] = [{
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
      // Caustics Texture
      binding: 5,
      visibility: GPUShaderStage.FRAGMENT,
      texture: {}
    }, {
      // Cluster Bounds
      binding: 6,
      visibility: GPUShaderStage.FRAGMENT,
      buffer: { type: 'read-only-storage' }
    }, {
      // Decal Data
      binding: 7,
      visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
      buffer: { type: 'read-only-storage' }
    }];

    if (!this.config.useBindless) {
      frameBGLEntries.push({
        // Decal Array Texture
        binding: 8,
        visibility: GPUShaderStage.FRAGMENT,
        texture: { viewDimension: '2d-array' }
      });
    }

    this.frameBGL = device.createBindGroupLayout({
      label: 'Frame',
      entries: frameBGLEntries
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

    this.depthPrepass = new GeometryInstancePass(this.depthAttachmentLayout, (material: MaterialBase) => {
      if (material instanceof UnlitMaterial) {
        return {
          pipelineFactory: this.unlitPipelineFactory,
          onBindMaterial(renderPass: GPURenderPassEncoder, material: MaterialBase) {
            renderPass.setBindGroup(1, (material as UnlitMaterial).materialBindGroup);
          },
          onInstancePipelineArgs: (geometryInstances: GeometryInstances) => {
            return new UnlitPipelineArgs({
              material,
              mirrored: geometryInstances.mirrored,
              depthPrepass: true,
            });
          }
        };
      }
    });

    this.forwardPass = new GeometryInstancePass(this.attachmentLayout, (material: MaterialBase) => {
      if (material instanceof UnlitMaterial) {
        return {
          pipelineFactory: this.unlitPipelineFactory,
          onBindMaterial(renderPass: GPURenderPassEncoder, material: MaterialBase) {
            renderPass.setBindGroup(1, (material as UnlitMaterial).materialBindGroup);
          },
          onInstancePipelineArgs: (geometryInstances: GeometryInstances) => {
            return new UnlitPipelineArgs({
              material,
              mirrored: geometryInstances.mirrored,
              depthPrepass: false,
            });
          }
        };
      } else if (material instanceof PBRMaterial) {
        return {
          pipelineFactory: this.pbrPipelineFactory,
          onBindMaterial(renderPass: GPURenderPassEncoder, material: MaterialBase) {
            renderPass.setBindGroup(1, (material as PBRMaterial).materialBindGroup);
          },
          onInstancePipelineArgs: () => new PBRPipelineArgs({material})
        };
      }
    });
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

      const entries: GPUBindGroupEntry[] = [{
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
        resource: this.causticsTexture ?? this.whiteTexture,
      }, {
        binding: 6,
        resource: this.clusterManager.clusterBoundsBuffer,
      }, {
        binding: 7,
        resource: this.decalManager.decalBuffer,
      }, ];

      if (!this.config.useBindless) {
        entries.push({
          binding: 8,
          resource: this.decalManager.decalTextureArray!.createView({
            label: 'Decal',
            dimension: '2d-array'
          }),
        });
      }

      this.#frameBindGroup = this.device.createBindGroup({
        label: 'Frame',
        layout: this.frameBGL,
        entries
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

    //==========================
    // Depth Prepass (Optional)
    //==========================

    // Perform a depth prepass if requested
    if (this.config.useDepthPrepass) {
      const depthPassDesc: GPURenderPassDescriptor = {
        colorAttachments: [],
        depthStencilAttachment: {
          view: this.depthStencilTexture!,
          depthLoadOp: 'clear',
          depthClearValue: 0,
          depthStoreOp: 'store',
        },
        timestampWrites: this.timestampHelper.timestampWrites('Depth Prepass'),
      };

      if (this.config.useBindless) {
        // @ts-expect-error
        depthPassDesc.resourceTable = this.decalManager.decalResourceTable;
      }

      const renderPass = commandEncoder.beginRenderPass(depthPassDesc);
      renderPass.setBindGroup(0, this.frameBindings);

      // Loop through just the unlit instances and pre-populate the depth buffer to avoid costly
      // decal fragment shaders in the forward pass.
      this.depthPrepass.drawGeometryInstances(renderPass, this.instanceManager);

      renderPass.end();
    }

    //=====================
    // Forward Render Pass
    //=====================

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
        depthLoadOp: this.config.useDepthPrepass ? 'load' : 'clear',
        depthClearValue: 0,
        depthStoreOp: 'discard',
      },
      timestampWrites: this.timestampHelper.timestampWrites('Main Renderpass')
    };

    if (this.config.useBindless) {
      // @ts-expect-error
      passDesc.resourceTable = this.decalManager.decalResourceTable;
    }

    const renderPass = commandEncoder.beginRenderPass(passDesc);
    renderPass.setBindGroup(0, this.frameBindings);

    // Loop through the gathered instances and render
    this.forwardPass.drawGeometryInstances(renderPass, this.instanceManager);

    renderPass.end();

    this.timestampHelper.resolve(commandEncoder);

    this.device.queue.submit([commandEncoder.finish()]);
  }
}
