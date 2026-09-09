import { CameraBindings } from "./common.ts";

export const TILE_COUNT = [32, 18, 48];
export const TOTAL_TILES = TILE_COUNT[0] * TILE_COUNT[1] * TILE_COUNT[2];

export const WORKGROUP_SIZE = [4, 2, 4];

export const ClusterBoundsUpdateSource = /*wgsl*/`
  ${CameraBindings}

  struct ClusterBounds {
    minAABB : vec3<f32>,
    maxAABB : vec3<f32>,
  };
  struct Clusters {
    bounds : array<ClusterBounds, ${TOTAL_TILES}>
  };
  @group(0) @binding(1) var<storage, read_write> clusters : Clusters;

  fn lineIntersectionToZPlane(a : vec3<f32>, b : vec3<f32>, zDistance : f32) -> vec3<f32> {
    let normal = vec3(0.0, 0.0, 1.0);
    let ab =  b - a;
    let t = (zDistance - dot(normal, a)) / dot(normal, ab);
    return a + t * ab;
  }

  fn clipToView(clip : vec4<f32>) -> vec4<f32> {
    let view = camera.invProjection * clip;
    return view / vec4(view.w, view.w, view.w, view.w);
  }

  fn screen2View(screen : vec4<f32>) -> vec4<f32> {
    let texCoord = screen.xy / camera.outputSize.xy;
    let clip = vec4(vec2(texCoord.x, 1.0 - texCoord.y) * 2.0 - vec2(1.0, 1.0), screen.z, screen.w);
    return clipToView(clip);
  }

  const tileCount = vec3u(${TILE_COUNT[0]}, ${TILE_COUNT[1]}, ${TILE_COUNT[2]});
  const eyePos = vec3(0.0);

  @compute @workgroup_size(${WORKGROUP_SIZE[0]}, ${WORKGROUP_SIZE[1]}, ${WORKGROUP_SIZE[2]})
  fn computeMain(@builtin(global_invocation_id) global_id : vec3<u32>) {
    let tileIndex : u32 = global_id.x +
                          global_id.y * tileCount.x +
                          global_id.z * tileCount.x * tileCount.y;

    let tileSize = vec2(camera.outputSize.x / f32(tileCount.x),
                        camera.outputSize.y / f32(tileCount.y));

    let maxPoint_sS = vec4(vec2(f32(global_id.x+1u), f32(global_id.y+1u)) * tileSize, 0.0, 1.0);
    let minPoint_sS = vec4(vec2(f32(global_id.x), f32(global_id.y)) * tileSize, 0.0, 1.0);

    let maxPoint_vS = screen2View(maxPoint_sS).xyz;
    let minPoint_vS = screen2View(minPoint_sS).xyz;

    let tileNear : f32 = -camera.zRange[0] * pow(camera.zRange[1]/ camera.zRange[0], f32(global_id.z)/f32(tileCount.z));
    let tileFar : f32 = -camera.zRange[0] * pow(camera.zRange[1]/ camera.zRange[0], f32(global_id.z+1u)/f32(tileCount.z));

    let minPointNear = lineIntersectionToZPlane(eyePos, minPoint_vS, tileNear);
    let minPointFar = lineIntersectionToZPlane(eyePos, minPoint_vS, tileFar);
    let maxPointNear = lineIntersectionToZPlane(eyePos, maxPoint_vS, tileNear);
    let maxPointFar = lineIntersectionToZPlane(eyePos, maxPoint_vS, tileFar);

    clusters.bounds[tileIndex].minAABB = min(min(minPointNear, minPointFar),min(maxPointNear, maxPointFar));
    clusters.bounds[tileIndex].maxAABB = max(max(minPointNear, minPointFar),max(maxPointNear, maxPointFar));
  }
`;

export const TileFunctions = /*wgsl*/`
const tileCount = vec3(${TILE_COUNT[0]}u, ${TILE_COUNT[1]}u, ${TILE_COUNT[2]}u);

fn linearDepth(depthSample : f32) -> f32 {
  return camera.zRange[1] * camera.zRange[0] / fma(depthSample, camera.zRange[0]-camera.zRange[1], camera.zRange[1]);
}

fn getTile(fragCoord : vec4f) -> vec3u {
  // TODO: scale and bias calculation can be moved outside the shader to save cycles.
  let sliceScale = f32(tileCount.z) / log2(camera.zRange[1] / camera.zRange[0]);
  let sliceBias = -(f32(tileCount.z) * log2(camera.zRange[0]) / log2(camera.zRange[1] / camera.zRange[0]));
  let zTile = u32(max(log2(linearDepth(fragCoord.z)) * sliceScale + sliceBias, 0.0));

  return vec3(u32(fragCoord.x / (camera.outputSize.x / f32(tileCount.x))),
              u32(fragCoord.y / (camera.outputSize.y / f32(tileCount.y))),
              zTile);
}

fn getClusterIndex(fragCoord : vec4f) -> u32 {
  let tile = getTile(fragCoord);
  return tile.x +
         tile.y * tileCount.x +
         tile.z * tileCount.x * tileCount.y;
}
`;