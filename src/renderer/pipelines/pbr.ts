import { WebGPURenderer } from "../webgpu-renderer.ts";
import { RenderPipelineFactory } from "../pipeline-factory.ts";
import { AttachmentLayout } from "../attachment-layout.ts";
import { GeometryLayout } from "../../geometry/geometry-layout.ts";
import { wgsl } from "../../util/wgsl-preprocessor.ts";
import { AttribLocation } from "../../geometry/geometry.ts";
import { FrameBindings, SRGBConversions } from "./common.ts";

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
          ${FrameBindings}

          struct Material {
            baseColorFactor: vec4f,
            metallicRoughnessFactor: vec2f,
            emissiveFactor: vec4f,
          };

          @group(1) @binding(0) var<uniform> material: Material;
          @group(1) @binding(1) var materialSampler: sampler;
          @group(1) @binding(2) var baseColorTexture: texture_2d<f32>;
          @group(1) @binding(3) var normalTexture: texture_2d<f32>;
          @group(1) @binding(4) var metallicRoughnessTexture: texture_2d<f32>;
          @group(1) @binding(5) var occlusionTexture: texture_2d<f32>;
          @group(1) @binding(6) var emissiveTexture: texture_2d<f32>;

          ${geometryLayout.getStandardVertexInStruct()}

          struct VertexOut {
            @builtin(position) pos: vec4f,
            @location(0) texCoord: vec2f,
            @location(1) normal: vec3f,
            @location(2) worldPos: vec4f,
            @location(3) color: vec4f,
          #if ${geometryLayout.locationsUsed.has(AttribLocation.tangent)}
            @location(4) tangent: vec3f,
            @location(5) bitangent: vec3f,
          #endif
          };

          @vertex
          fn vertMain(in: VertexIn, @builtin(instance_index) instanceIdx: u32) -> VertexOut {
            let instanceId = instanceIndices[instanceIdx];
            let instance = instances[instanceId];

            var out: VertexOut;

            out.worldPos = instance.model * in.position;
            out.pos = camera.projection * camera.view * out.worldPos;
            out.texCoord = in.texcoord0;
            out.normal = normalize(instance.normal * in.normal);
          #if ${geometryLayout.locationsUsed.has(AttribLocation.color)}
            out.color = in.color;
          #else
            out.color = vec4f(1);
          #endif
          #if ${geometryLayout.locationsUsed.has(AttribLocation.tangent)}
            out.tangent = normalize(instance.normal * in.tangent.xyz);
            out.bitangent = cross(out.normal, out.tangent) * in.tangent.w;
          #endif

            return out;
          }

          ${SRGBConversions}

          struct FragOut {
            @location(0) color: vec4f,
            @location(1) decalId: u32,
          }

          @fragment
          fn fragMain(in: VertexOut) -> FragOut {

          #if ${geometryLayout.locationsUsed.has(AttribLocation.tangent)}
            let tbn = mat3x3f(in.tangent, in.bitangent, in.normal);
            let texNormal = textureSample(normalTexture, materialSampler, in.texCoord).rgb;
            let normal = normalize(tbn * (texNormal * 2 - 1));
          #else
            let normal = normalize(in.normal);
          #endif

            let environment = textureSample(environmentTexture, materialSampler, normal);

            let baseColor = in.color * material.baseColorFactor * textureSample(baseColorTexture, materialSampler, in.texCoord);
            let metalRough = material.metallicRoughnessFactor * textureSample(metallicRoughnessTexture, materialSampler, in.texCoord).bg;

            var out: FragOut;
            out.decalId = 0;

            let color = baseColor.rgb + (environment.rgb * metalRough.r);
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