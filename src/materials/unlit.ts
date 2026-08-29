import { Vec4, Vec4Like } from "gl-matrix";
import { RenderPipelineFactory } from "../renderer/pipeline-factory.ts";
import { WebGPURenderer } from "../renderer/webgpu-renderer.ts";
import { AttachmentLayout } from "../renderer/attachment-layout.ts";
import { GeometryLayout } from "../geometry/geometry-layout.ts";
import { MaterialBase } from "./material-base.ts";

export interface UnlitMaterialDesc {
  label?: string;
  transparent?: boolean;
  doubleSided?: boolean;
  baseColorFactor?: Vec4Like;
  baseColorTexture?: GPUTexture;
}

export class UnlitMaterial extends MaterialBase implements UnlitMaterialDesc {
  static SharedComponent = true;

  uniformBuffer: GPUBuffer;
  materialBindGroup: GPUBindGroup;

  label?: string;
  transparent: boolean;
  doubleSided: boolean;
  baseColorFactor: Vec4;
  baseColorTexture?: GPUTexture;

  constructor(gpu: WebGPURenderer, desc?: UnlitMaterialDesc) {
    super();

    this.label = desc?.label;
    this.transparent = desc?.transparent ?? false;
    this.doubleSided = desc?.doubleSided ?? false;
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
    });

    const mapped = new Float32Array(this.uniformBuffer.getMappedRange());
    mapped.set(this.baseColorFactor, 0);

    this.uniformBuffer.unmap();

    // Materials are immutable after creation.
    Object.freeze(this);
  }
}

interface UnlitPipelineArgs {
  transparent: boolean,
  doubleSided: boolean,
  mirrored: boolean,
}

export class UnlitPipelineFactory extends RenderPipelineFactory<UnlitPipelineArgs> {
  materialBGL: GPUBindGroupLayout;
  pipelineLayout: GPUPipelineLayout;

  constructor(gpu: WebGPURenderer) {
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
      bindGroupLayouts: [gpu.cameraBGL, gpu.instanceBGL, gpu.decalBGL, this.materialBGL]
    });
  }

  getPipelineDescriptor(
    geometryLayout: GeometryLayout,
    attachmentLayout: AttachmentLayout,
    args: UnlitPipelineArgs): GPURenderPipelineDescriptor {
      const module = this.device.createShaderModule({
        label: 'Unlit Material',
        code: /* wgsl */`
          ${geometryLayout.getStandardVertexInStruct()}

          struct VertexOut {
            @builtin(position) pos: vec4f,
            @location(0) texCoord: vec2f,
            @location(1) worldPos: vec4f,
          };

          struct Camera {
            projection: mat4x4f,
            invProjection: mat4x4f,
            view: mat4x4f,
            viewPos: vec3f,
          };

          @group(0) @binding(0) var<uniform> camera: Camera;

          @group(1) @binding(0) var<storage> transforms: array<mat4x4f>;
          @group(1) @binding(1) var<storage> transformIndices: array<u32>;

          struct Decal {
            decalProj: mat4x4f,
          };
          @group(2) @binding(0) var<uniform> decal: Decal;
          @group(2) @binding(1) var decalTexture: texture_2d<f32>;
          @group(2) @binding(2) var decalSampler: sampler;

          struct Material {
            baseColorFactor: vec4f,
          };

          @group(3) @binding(0) var<uniform> material: Material;
          @group(3) @binding(1) var baseColorTexture: texture_2d<f32>;
          @group(3) @binding(2) var texSampler: sampler;

          @vertex
          fn vertMain(in: VertexIn, @builtin(instance_index) instance: u32) -> VertexOut {
            let transformIndex = transformIndices[instance];
            let modelMat = transforms[transformIndex];
            let worldPos = modelMat * in.position;
            let pos = camera.projection * camera.view * worldPos;
            return VertexOut(pos, in.texcoord0, worldPos);
          }

          const GAMMA = 2.2f;
          const INV_GAMMA = 1.0f / GAMMA;
          fn linearTosRGB(linear : vec3f) -> vec3f {
            return pow(linear, vec3(INV_GAMMA));
          }

          fn sRGBToLinear(srgb : vec3f) -> vec3f {
            return pow(srgb, vec3(GAMMA));
          }

          const projBias = mat4x4f(
            0.5, 0, 0, 0,
            0, -0.5, 0, 0,
            0, 0, 0.5, 0,
            0.5, 0.5, 0.5, 1,
          );

          @fragment
          fn fragMain(in: VertexOut) -> @location(0) vec4f {
            let baseColor = material.baseColorFactor * textureSample(baseColorTexture, texSampler, in.texCoord);

            let decalProjCoord = projBias * decal.decalProj * in.worldPos;
            let decalUv = decalProjCoord.xyz / decalProjCoord.w;
            var decalColor = textureSample(decalTexture, decalSampler, decalUv.xy);

            if (any(decalUv < vec3f(0)) || any(decalUv > vec3f(1))) {
              decalColor = vec4f(0);
            }

            // Best guess for the base color of the lighter grey walls.
            let estAlbedo = vec3f(0.6, 0.65, 0.65);
            let lightEst = baseColor.rgb / estAlbedo;
            let color = (baseColor.rgb * (1.0 - decalColor.a)) + ((decalColor.rgb * (decalColor.a)) * lightEst);
            return vec4(linearTosRGB(color), baseColor.a);
          }
        `,
      });

      return {
        label: 'Unlit Material',
        layout: this.pipelineLayout,
        vertex: { module, buffers: geometryLayout.buffers },
        primitive: {
          topology: geometryLayout.topology,
          cullMode: args.doubleSided ? 'none' : (args.mirrored ? 'front' : 'back'),
        },
        depthStencil: {
          format: attachmentLayout.depthStencilFormat!,
          depthWriteEnabled: true,
          depthCompare: 'greater',
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