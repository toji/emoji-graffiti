import { WebGPURenderer } from "../webgpu-renderer.ts";
import { RenderPipelineFactory } from "../pipeline-factory.ts";
import { AttachmentLayout } from "../attachment-layout.ts";
import { GeometryLayout } from "../../geometry/geometry-layout.ts";
import { wgsl } from "../../util/wgsl-preprocessor.ts";
import { DecalFrameBindings, SRGBConversions } from "./common.ts";
import { TILE_COUNT, TileFunctions } from "./clusters.ts";
import { AttribLocation } from "../../geometry/geometry.ts";

interface UnlitPipelineArgs {
  transparent: boolean,
  doubleSided: boolean,
  mirrored: boolean,
  canDecal: boolean,
  depthTest: boolean,
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
      bindGroupLayouts: [gpu.frameBGL, this.materialBGL]
    });
  }

  getPipelineDescriptor(
    geometryLayout: GeometryLayout,
    attachmentLayout: AttachmentLayout,
    args: UnlitPipelineArgs): GPURenderPipelineDescriptor {
      const module = this.device.createShaderModule({
        label: 'Unlit Material',
        code: wgsl`
          ${DecalFrameBindings}

          struct Material {
            baseColorFactor: vec4f,
            baseAlbedo: vec3f,
          };

          @group(1) @binding(0) var<uniform> material: Material;
          @group(1) @binding(1) var baseColorTexture: texture_2d<f32>;
          @group(1) @binding(2) var texSampler: sampler;

          ${geometryLayout.getStandardVertexInStruct()}

          struct VertexOut {
            @builtin(position) pos: vec4f,
            @location(0) texCoord: vec2f,
            @location(1) normal: vec3f,
            @location(2) worldPos: vec4f,
          };

          @vertex
          fn vertMain(in: VertexIn, @builtin(instance_index) instanceIdx: u32) -> VertexOut {
            let instanceId = instanceIndices[instanceIdx];
            let instance = instances[instanceId];
            let worldPos = instance.model * in.position;
            let pos = camera.projection * camera.view * worldPos;

          #if ${geometryLayout.locationsUsed.has(AttribLocation.normal)}
            let n = normalize(instance.normal * in.normal);
          #else
            let n = normalize(instance.normal * vec3f(0, 0, 1));
          #endif

          #if ${geometryLayout.locationsUsed.has(AttribLocation.texcoord0)}
            let texCoord = in.texcoord0;
          #else
            let texCoord = vec2f(0);
          #endif

            return VertexOut(pos, texCoord, n, worldPos);
          }

          ${SRGBConversions}

          ${TileFunctions}

          const projBias = mat4x4f(
            0.5, 0, 0, 0,
            0, -0.5, 0, 0,
            0, 0, 0.5, 0,
            0.5, 0.5, 0.5, 1,
          );

          struct FragOut {
            @location(0) color: vec4f,
            @location(1) decalId: u32,
          }

          @fragment
          fn fragMain(in: VertexOut) -> FragOut {
            let baseColor = material.baseColorFactor * textureSample(baseColorTexture, texSampler, in.texCoord);

            var out: FragOut;

          #if ${args.canDecal}
            let estAlbedo = material.baseAlbedo;
            let lightEst = baseColor.rgb / estAlbedo;

            let causticsUv = (in.pos.xy / vec2f(textureDimensions(causticsTexture)));

            let causticsA = textureSample(causticsTexture, defaultSampler, causticsUv + vec2(camera.time * 0.25, 0));
            let causticsB = textureSample(causticsTexture, defaultSampler, -causticsUv - vec2(0, camera.time * 0.1));
            let caustics = (causticsA + causticsB) * 0.5;

            var decalAccumColor = vec4f(0);
            for (var i = 0u; i < decals.decalCount; i++) {
              let decalProjCoord = projBias * decals.decal[i].decalProj * in.worldPos;
              let decalUv = decalProjCoord.xyz / decalProjCoord.w;
              var decalColor = textureSample(decalTexture, defaultSampler, decalUv.xy, decals.decal[i].textureIndex);

              // TODO: Check to ensure in.normal is facing towards the decal.
              let originToPoint = decals.decal[i].origin - in.worldPos.xyz;
              let nDotO = dot(in.normal, originToPoint);

              if (nDotO > 0 && all(decalUv >= vec3f(0)) && all(decalUv <= vec3f(1))) {
                let decalAlpha = decals.decal[i].opacity * decalColor.a;
                decalAccumColor = vec4((decalAccumColor.rgb * (1.0 - decalAlpha)) + (decalColor.rgb * decalAlpha), decalAccumColor.a + decalAlpha);

                if (decals.decal[i].highlight == 1) {
                  decalAccumColor += caustics * decalAlpha;
                }

                decalAccumColor.a = min(decalAccumColor.a, 1);

                if (decalAlpha > 0.2) {
                  out.decalId = decals.decal[i].id;
                }
              }
            }

            let color = (baseColor.rgb * (1.0 - decalAccumColor.a)) + ((decalAccumColor.rgb * lightEst) * decalAccumColor.a);
          #else
            let color = baseColor.rgb;
          #endif
            //let tileColor = vec3f(getTile(in.pos)) / vec3f(${TILE_COUNT[0]}, ${TILE_COUNT[1]}, ${TILE_COUNT[2]});

            out.color = vec4(linearTosRGB(color), baseColor.a);

            return out;
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
          depthCompare: args.depthTest ? 'greater' : 'always',
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