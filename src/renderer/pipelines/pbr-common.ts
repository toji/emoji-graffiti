import { wgsl } from "../../util/wgsl-preprocessor.ts";

export const PBR_MATERIAL = (group: number = 2) => {
  return /* wgsl */`
    struct MaterialUniforms {
      baseColorFactor: vec4f,
      emissiveFactor: vec3f,
      occlusionStrength : f32,
      metallicRoughnessFactor : vec2f,
      alphaCutoff: f32,
    };
    @group(2) @binding(0) var<uniform> material : MaterialUniforms;

    @group(2) @binding(1) var materialSampler : sampler;
    @group(2) @binding(2) var baseColorTexture : texture_2d<f32>;
    @group(2) @binding(3) var normalTexture : texture_2d<f32>;
    @group(2) @binding(4) var metallicRoughnessTexture : texture_2d<f32>;
  `;
}

export const SurfaceInfoStruct = `
  struct SurfaceInfo {
    worldPos: vec3f,
    fragPos: vec2f,
    V: vec3f, // normalized vector from the shading location to the eye
    N: vec3f, // surface normal in the world space
    specularColor: vec3f,
    diffuseColor: vec3f,
    metal: f32,
    rough: f32,
    f0: vec3f,
    ao: f32,
    alpha: f32,
  };
`;

//----------------------
// Image-based lighting
//----------------------

export const PBRFunctions = /* wgsl */`
  const PI = ${Math.PI};
  const MIN_ROUGHNESS = 0.045;

  fn getSpecularLightColor(R: vec3f, roughness: f32) -> vec3f {
    let envLevels = f32(textureNumLevels(environmentTexture));

    let rough = envLevels * roughness * (2.0 - roughness);

    return textureSampleLevel(environmentTexture, defaultSampler, R, rough).rgb;
  }

  fn getDiffuseLightColor(N: vec3f) -> vec3f {
    let diffuseLevel = f32(textureNumLevels(environmentTexture) - 1);
    return textureSampleLevel(environmentTexture, defaultSampler, N, diffuseLevel).rgb;
  }

  fn FresnelSchlickRoughness(cosTheta: f32, F0: vec3f, roughness: f32) -> vec3f {
    return F0 + (max(vec3f(1 - roughness), F0) - F0) * pow(clamp(1 - cosTheta, 0, 1), 5);
  }

  // From https://www.unrealengine.com/en-US/blog/physically-based-shading-on-mobile
  fn envBRDFApprox(roughness: f32, NdotV: f32) -> vec2f {
    let c0 = vec4f(-1, -0.0275, -0.572, 0.022);
    let c1 = vec4f(1, 0.0425, 1.04, -0.04);
    let r = roughness * c0 + c1;
    let a004 = min(r.x * r.x, exp2(-9.28 * NdotV)) * r.x + r.y;
    return vec2f(-1.04, 1.04) * a004 + r.zw;
  }

  fn pbrSurfaceColorIbl(surface: SurfaceInfo) -> vec3f {
    let NdotV = max(dot(surface.N, surface.V), 0);
    let R = reflect(-surface.V, surface.N);

    let kS = FresnelSchlickRoughness(NdotV, surface.f0, surface.rough);
    let kD = (1 - kS) * (1 - surface.metal);
    let irradiance = getDiffuseLightColor(surface.N);
    let diffuse    = vec3f(0); //irradiance * surface.diffuseColor;

    let prefilteredColor = getSpecularLightColor(R, surface.rough);
    let envBrdf = envBRDFApprox(surface.rough, NdotV);
    let specular = prefilteredColor * (surface.specularColor * envBrdf.x + envBrdf.y);

    let ambient    = (kD * diffuse + specular) * surface.ao;
    return ambient;
  }
`;