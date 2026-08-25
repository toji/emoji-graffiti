import { Vec4, Vec4Like } from "gl-matrix";
import { RenderPipelineFactory } from "../pipeline-factory.ts";
import { WebGPURenderer } from "../../../webgpu-renderer.ts";
import { GeometryLayout } from "../geometry-layout.ts";
import { AttachmentLayout } from "../attachment-layout.ts";
import { AttribLocation } from "../geometry.ts";
import { MaterialBase } from "./material-base.ts";

export interface UnlitMaterialDesc {
  label?: string;
  transparent?: boolean;
  baseColorFactor?: Vec4Like;
  baseColorTexture?: GPUTexture;
}

export class UnlitMaterial extends MaterialBase implements UnlitMaterialDesc {
  static SharedComponent = true;

  uniformBuffer: GPUBuffer;
  materialBindGroup: GPUBindGroup;

  label?: string;
  transparent: boolean;
  baseColorFactor: Vec4;
  baseColorTexture?: GPUTexture;

  constructor(gpu: WebGPURenderer, desc?: UnlitMaterialDesc) {
    super();

    this.label = desc?.label;
    this.transparent = desc?.transparent ?? false;
    this.baseColorFactor = new Vec4(desc?.baseColorFactor ?? [1, 1, 1, 1]);
    this.baseColorTexture = desc?.baseColorTexture ?? gpu.whiteTexture;

    this.uniformBuffer = gpu.device.createBuffer({
      label: 'Unlit Material',
      size: Vec4.BYTE_LENGTH,
      usage: GPUBufferUsage.UNIFORM,
      mappedAtCreation: true,
    });

    this.materialBindGroup = gpu.device.createBindGroup({
      label: 'Unlit Material',
      layout: gpu.unlitPipelineFactory.materialBGL,
      entries: [{
        binding: 0,
        resource: this.uniformBuffer,
      }, {
        binding: 1,
        resource: this.baseColorTexture,
      }, {
        binding: 2,
        resource: gpu.defaultSampler,
      }]
    })

    const mapped = new Float32Array(this.uniformBuffer.getMappedRange());
    mapped.set(this.baseColorFactor, 0);

    this.uniformBuffer.unmap();

    // Materials are immutable after creation.
    Object.freeze(this);
  }
}

const EMOJI_SHADER = /* wgsl */`
  requires immediate_address_space;

  struct VertexIn {
    @location(${AttribLocation.position}) pos: vec4f,
    @location(${AttribLocation.texcoord0}) texCoord: vec2f,
    @builtin(instance_index) instance: u32,
  };

  struct VertexOut {
    @builtin(position) pos: vec4f,
    @location(0) texCoord: vec2f,
  };

  struct Camera {
    projection: mat4x4f,
    view: mat4x4f,
  };

  @group(0) @binding(0) var<uniform> camera: Camera;

  @group(1) @binding(0) var<storage> transforms: array<mat4x4f>;
  @group(1) @binding(1) var<storage> transformIndices: array<u32>;

  struct Material {
    baseColorFactor: vec4f,
  };
//
  @group(2) @binding(0) var<uniform> material: Material;
  @group(2) @binding(1) var baseColorTexture: texture_2d<f32>;
  @group(2) @binding(2) var texSampler: sampler;

  @vertex
  fn vertMain(in: VertexIn) -> VertexOut {
    let transformIndex = transformIndices[in.instance];
    let modelMat = transforms[transformIndex];
    let pos = camera.projection * camera.view * modelMat * in.pos;
    let texCoord = in.texCoord;
    return VertexOut(pos, texCoord);
  }

  @fragment
  fn fragMain(in: VertexOut) -> @location(0) vec4f {
    let baseColor = material.baseColorFactor * textureSample(baseColorTexture, texSampler, in.texCoord);
    //let baseColor = vec4f(1, 1, 0, 1);
    return vec4(baseColor.rgb, 1.0);
  }
`;

interface UnlitPipelineArgs {
  transparent: boolean,
}

export class UnlitPipelineFactory extends RenderPipelineFactory<UnlitPipelineArgs> {
  materialBGL: GPUBindGroupLayout;
  pipelineLayout: GPUPipelineLayout;

  constructor(gpu: WebGPURenderer, cameraBGL: GPUBindGroupLayout, instanceBGL: GPUBindGroupLayout) {
    const config = gpu.config.watch();
    super(gpu.device, config);

    this.materialBGL = gpu.device.createBindGroupLayout({
      label: 'Unlit Material',
      entries: [{
        binding: 0,
        visibility: GPUShaderStage.FRAGMENT,
        buffer: {}
      }, {
        binding: 1,
        visibility: GPUShaderStage.FRAGMENT,
        texture: {}
      }, {
        binding: 2,
        visibility: GPUShaderStage.FRAGMENT,
        sampler: {}
      }]
    });

    this.pipelineLayout = gpu.device.createPipelineLayout({
      bindGroupLayouts: [cameraBGL, instanceBGL, this.materialBGL]
    });
  }

  getPipelineDescriptor(
    geometryLayout: GeometryLayout,
    attachmentLayout: AttachmentLayout,
    args: UnlitPipelineArgs): GPURenderPipelineDescriptor {
      const module = this.device.createShaderModule({
        label: 'Unlit Material',
        code: EMOJI_SHADER,
      });

      return {
        label: 'Unlit Material',
        layout: this.pipelineLayout,
        vertex: { module, buffers: geometryLayout.buffers },
        depthStencil: {
          format: attachmentLayout.depthStencilFormat!,
          depthWriteEnabled: true,
          depthCompare: 'less',
        },
        fragment: {
          module,
          targets: attachmentLayout.colorFormats.map((format: GPUTextureFormat, index) => {
            const target: GPUColorTargetState = {
              format
            };
            if (args.transparent) {
              if (index == 0) {
                target.blend = {
                  color: {
                    srcFactor: 'src-alpha',
                    dstFactor: 'one-minus-src-alpha'
                  },
                  alpha: {
                    srcFactor: 'one',
                    dstFactor: 'one',
                  }
                }
              } else {
                target.writeMask = 0;
              }
            }
            return target;
          })}
      };
  }
}