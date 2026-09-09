export const CameraBindings = /* wgsl */`
  struct Camera {
    projection: mat4x4f,
    invProjection: mat4x4f,
    view: mat4x4f,
    viewPos: vec3f,
    time: f32,
    zRange: vec2f,
    outputSize: vec2f,
  };

  @group(0) @binding(0) var<uniform> camera: Camera;
`;

export const FrameBindings = /* wgsl */`
  ${CameraBindings}

  struct Instance {
    model: mat4x4f,
    normal: mat3x3f,
  }
  @group(0) @binding(1) var<storage> instances: array<Instance>;
  @group(0) @binding(2) var<storage> instanceIndices: array<u32>;

  @group(0) @binding(3) var defaultSampler: sampler;
  @group(0) @binding(4) var environmentTexture: texture_cube<f32>;
`;

export const DecalFrameBindings = /* wgsl */`
  ${FrameBindings}

  struct Decal {
    id: u32,
    textureIndex: u32,
    opacity: f32,
    highlight: u32,
    origin: vec3f,
    decalProj: mat4x4f,
  };
  struct SceneDecals {
    decalCount: u32,
    decal: array<Decal>,
  };
  @group(0) @binding(5) var<storage> decals: SceneDecals;
  @group(0) @binding(6) var decalTexture: texture_2d_array<f32>;
  @group(0) @binding(7) var causticsTexture: texture_2d<f32>;
`;

export const SRGBConversions = /* wgsl */`
  const GAMMA = 2.2f;
  fn sRGBToLinear(srgb : vec3f) -> vec3f {
    return pow(srgb, vec3(GAMMA));
  }

  const INV_GAMMA = 1.0f / GAMMA;
  fn linearTosRGB(linear : vec3f) -> vec3f {
    return pow(linear, vec3(INV_GAMMA));
  }
`;