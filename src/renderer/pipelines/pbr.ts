import { WebGPURenderer } from "../webgpu-renderer.ts";
import { RenderPipelineFactory } from "../pipeline-factory.ts";
import { AttachmentLayout } from "../attachment-layout.ts";
import { GeometryLayout } from "../../geometry/geometry-layout.ts";
import { wgsl } from "../../util/wgsl-preprocessor.ts";

interface PBRPipelineArgs {
  transparent: boolean,
  doubleSided: boolean,
  mirrored: boolean,
}

export class PBRPipelineFactory extends RenderPipelineFactory<PBRPipelineArgs> {
  materialBGL: GPUBindGroupLayout;
  pipelineLayout: GPUPipelineLayout;

  constructor(gpu: WebGPURenderer) {
    const config = gpu.config.watch();
    super(gpu.device, config);

    this.materialBGL = gpu.device.createBindGroupLayout({
      label: 'PBR Material',
      entries: [{
        binding: 0,
        visibility: GPUShaderStage.FRAGMENT,
        buffer: {}
      },  {
        binding: 1,
        visibility: GPUShaderStage.FRAGMENT,
        sampler: {}
      }, {
        binding: 2,
        visibility: GPUShaderStage.FRAGMENT,
        texture: {}
      }, {
        binding: 3,
        visibility: GPUShaderStage.FRAGMENT,
        texture: {}
      }, {
        binding: 4,
        visibility: GPUShaderStage.FRAGMENT,
        texture: {}
      }, {
        binding: 5,
        visibility: GPUShaderStage.FRAGMENT,
        texture: {}
      }, {
        binding: 6,
        visibility: GPUShaderStage.FRAGMENT,
        texture: {}
      }]
    });

    this.pipelineLayout = gpu.device.createPipelineLayout({
      bindGroupLayouts: [gpu.frameBGL, this.materialBGL]
    });
  }

  getPipelineDescriptor(
    geometryLayout: GeometryLayout,
    attachmentLayout: AttachmentLayout,
    args: PBRPipelineArgs): GPURenderPipelineDescriptor {
      const module = this.device.createShaderModule({
        label: 'PBR Material',
        code: wgsl`
          ${geometryLayout.getStandardVertexInStruct()}

          struct VertexOut {
            @builtin(position) pos: vec4f,
            @location(0) texCoord: vec2f,
            @location(1) normal: vec3f,
            @location(2) worldPos: vec4f,
          };

          struct Camera {
            projection: mat4x4f,
            invProjection: mat4x4f,
            view: mat4x4f,
            viewPos: vec3f,
            time: f32,
          };

          @group(0) @binding(0) var<uniform> camera: Camera;

          struct Instance {
            model: mat4x4f,
            normal: mat3x3f,
          }
          @group(0) @binding(1) var<storage> instances: array<Instance>;
          @group(0) @binding(2) var<storage> instanceIndices: array<u32>;

          @group(0) @binding(3) var defaultSampler: sampler;

          const GAMMA = 2.2f;
          const INV_GAMMA = 1.0f / GAMMA;
          fn linearTosRGB(linear : vec3f) -> vec3f {
            return pow(linear, vec3(INV_GAMMA));
          }

          fn sRGBToLinear(srgb : vec3f) -> vec3f {
            return pow(srgb, vec3(GAMMA));
          }

          struct Material {
            baseColorFactor: vec4f,
            metallicRoughnessFactor: vec2f,
            emissiveFactor: vec4f,
          };

          @group(1) @binding(0) var<uniform> material: Material;
          @group(1) @binding(1) var texSampler: sampler;
          @group(1) @binding(2) var baseColorTexture: texture_2d<f32>;
          @group(1) @binding(3) var normalTexture: texture_2d<f32>;
          @group(1) @binding(4) var metallicRoughnessTexture: texture_2d<f32>;
          @group(1) @binding(5) var occlusionTexture: texture_2d<f32>;
          @group(1) @binding(6) var emissiveTexture: texture_2d<f32>;

          @vertex
          fn vertMain(in: VertexIn, @builtin(instance_index) instanceIdx: u32) -> VertexOut {
            let instanceId = instanceIndices[instanceIdx];
            let instance = instances[instanceId];
            let worldPos = instance.model * in.position;
            let pos = camera.projection * camera.view * worldPos;
            let n = normalize(instance.normal * in.normal);
            return VertexOut(pos, in.texcoord0, n, worldPos);
          }

          struct FragOut {
            @location(0) color: vec4f,
            @location(1) decalId: u32,
          }

          @fragment
          fn fragMain(in: VertexOut) -> FragOut {
            let baseColor = material.baseColorFactor * textureSample(baseColorTexture, texSampler, in.texCoord);
            let metallicRoughness = material.metallicRoughnessFactor * textureSample(metallicRoughnessTexture, texSampler, in.texCoord).bg;

            var out: FragOut;
            out.decalId = 0;

            let color = baseColor.rgb * vec3f(metallicRoughness, 1);

            out.color = vec4(linearTosRGB(color), baseColor.a);

            return out;
          }
        `,
      });

      return {
        label: 'PBR Material',
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