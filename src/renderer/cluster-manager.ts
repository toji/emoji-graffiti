import { ClusterBoundsUpdateSource, TILE_COUNT, TOTAL_TILES, WORKGROUP_SIZE } from "./pipelines/clusters.ts";
import { WebGPURenderer } from "./webgpu-renderer.ts";

const DISPATCH_SIZE = [
  TILE_COUNT[0] / WORKGROUP_SIZE[0],
  TILE_COUNT[1] / WORKGROUP_SIZE[1],
  TILE_COUNT[2] / WORKGROUP_SIZE[2]];

// Cluster x, y, z size * 32 bytes per cluster.
export const CLUSTER_BOUNDS_SIZE = TOTAL_TILES * 32;

// Handles building and sorting of a screen-space cluster structure. Essentially the same as what is
// used for Clustered Lighting for Forward+ renderers, but used here to reduce the number of decals
// that need to be considered for any given fragment.
export class ClusterManager {
  gpu: WebGPURenderer;

  clusterBoundsUpdateBGL: GPUBindGroupLayout;
  clusterBoundsUpdateBindGroup: GPUBindGroup;
  clusterBoundsBuffer: GPUBuffer;
  boundsPipeline?: GPUComputePipeline;

  constructor(gpu: WebGPURenderer) {
    this.gpu = gpu;
    const device = gpu.device;

    this.clusterBoundsUpdateBGL = device.createBindGroupLayout({
      label: 'Cluster Bounds',
      entries: [{
        binding: 0,
        visibility: GPUShaderStage.COMPUTE,
        buffer: { type: 'uniform' }
      }, {
        binding: 1,
        visibility: GPUShaderStage.COMPUTE,
        buffer: { type: 'storage' }
      }]
    });

    this.clusterBoundsBuffer = device.createBuffer({
      label: 'Cluster Bounds',
      size: CLUSTER_BOUNDS_SIZE,
      usage: GPUBufferUsage.STORAGE
    });

    this.clusterBoundsUpdateBindGroup = device.createBindGroup({
      label: 'Cluster Bounds Update',
      layout: this.clusterBoundsUpdateBGL,
      entries: [{
        binding: 0,
        resource: gpu.cameraManager.cameraBuffer,
      }, {
        binding: 1,
        resource: this.clusterBoundsBuffer
      }]
    });

    // Pipeline creation
    device.createComputePipelineAsync({
      label: 'Cluster Bounds Update',
      layout: device.createPipelineLayout({
        bindGroupLayouts: [
          this.clusterBoundsUpdateBGL,
        ]
      }),
      compute: {
        module: device.createShaderModule({
          label: 'Cluster Bounds Update',
          code: ClusterBoundsUpdateSource
        }),
      }
    }).then((pipeline) => {
      this.boundsPipeline = pipeline;
    });
  }

  updateClusterBounds(commandEncoder: GPUCommandEncoder) {
    if (!this.boundsPipeline) { return; }

    const passEncoder = commandEncoder.beginComputePass({ label: 'Cluster Bounds Compute Pass'});
    passEncoder.setPipeline(this.boundsPipeline);
    passEncoder.setBindGroup(0, this.clusterBoundsUpdateBindGroup);
    passEncoder.dispatchWorkgroups(DISPATCH_SIZE[0], DISPATCH_SIZE[1], DISPATCH_SIZE[2]);
    passEncoder.end();
  }
}