import { WebGPURenderer } from "../webgpu-renderer.ts";
import { RenderPipelineFactory } from "../pipeline-factory.ts";
import { AttachmentLayout } from "../attachment-layout.ts";
import { GeometryLayout } from "../../geometry/geometry-layout.ts";
import { wgsl } from "../../util/wgsl-preprocessor.ts";

interface UnlitPipelineArgs {
  transparent: boolean,
  doubleSided: boolean,
  mirrored: boolean,
  canDecal: boolean,
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
      bindGroupLayouts: [gpu.cameraBGL, gpu.instanceBGL, gpu.decalManager.decalBGL, this.materialBGL]
    });
  }

  getPipelineDescriptor(
    geometryLayout: GeometryLayout,
    attachmentLayout: AttachmentLayout,
    args: UnlitPipelineArgs): GPURenderPipelineDescriptor {
      const module = this.device.createShaderModule({
        label: 'Unlit Material',
        code: wgsl`
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
            textureIndex: u32,
            opacity: f32,
            decalProj: mat4x4f,
          };
          struct SceneDecals {
            decalCount: u32,
            decal: array<Decal>,
          };
          @group(2) @binding(0) var<storage> decals: SceneDecals;
          @group(2) @binding(1) var decalTexture: texture_2d_array<f32>;
          @group(2) @binding(2) var decalSampler: sampler;

          struct Material {
            baseColorFactor: vec4f,
            baseAlbedo: vec3f,
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

          #if ${args.canDecal}
            let estAlbedo = material.baseAlbedo;
            let lightEst = baseColor.rgb / estAlbedo;

            var decalAccumColor = vec4f(0);
            for (var i = 0u; i < decals.decalCount; i++) {
              let decalProjCoord = projBias * decals.decal[i].decalProj * in.worldPos;
              let decalUv = decalProjCoord.xyz / decalProjCoord.w;
              var decalColor = textureSample(decalTexture, decalSampler, decalUv.xy, decals.decal[i].textureIndex);

              if (all(decalUv >= vec3f(0)) && all(decalUv <= vec3f(1))) {
                let decalAlpha = decals.decal[i].opacity * decalColor.a;
                decalAccumColor = vec4((decalAccumColor.rgb * (1.0 - decalAlpha)) + (decalColor.rgb * decalAlpha), decalAccumColor.a + decalAlpha);
                decalAccumColor.a = min(decalAccumColor.a, 1);
              }
            }

            let color = (baseColor.rgb * (1.0 - decalAccumColor.a)) + ((decalAccumColor.rgb * lightEst) * decalAccumColor.a);
          #else
            let color = baseColor.rgb;
          #endif
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