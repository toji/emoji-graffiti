import { Vec2, Vec4 } from "gl-matrix";
import { WebGPURenderer } from "./webgpu-renderer.ts";

export class SelectionManager {
  gpu: WebGPURenderer;

  selectionPipeline: GPUComputePipeline;
  selectionTexture?: GPUTexture;
  selectionBindGroupLayout: GPUBindGroupLayout;
  selectionBindGroup?: GPUBindGroup;
  selectionBuffer: GPUBuffer;
  selectionReadbackBuffers: GPUBuffer[] = [];
  immediateArray = new Uint32Array(2);

  constructor(gpu: WebGPURenderer) {
    this.gpu = gpu;

    this.selectionBindGroupLayout = gpu.device.createBindGroupLayout({
      label: 'Decal Selection',
      entries: [{
        binding: 0,
        visibility: GPUShaderStage.COMPUTE,
        texture: { sampleType: 'uint' }
      }, {
        binding: 1,
        visibility: GPUShaderStage.COMPUTE,
        buffer: { type: 'storage' }
      }]
    });

    this.selectionBuffer = gpu.device.createBuffer({
      label: 'Decal Selection',
      size: Vec4.BYTE_LENGTH,
      usage: GPUBufferUsage.COPY_SRC | GPUBufferUsage.STORAGE
    });

    const module = gpu.device.createShaderModule({
      label: 'Decal Selection',
      code: `
        var<immediate> selectCoord: vec2u;

        @group(0) @binding(0) var selectionTexture: texture_2d<u32>;
        @group(0) @binding(1) var<storage, read_write> selection: u32;

        const samplePoints = array<vec2i, 5>(
          vec2i(0, 0), vec2i(-5, -5), vec2i(5, -5), vec2i(-5, 5), vec2i(5, 5));

        @compute @workgroup_size(1, 1, 1)
        fn computeMain() {
          for (var i = 0; i < 5; i++) {
            selection = textureLoad(selectionTexture, vec2i(selectCoord) + samplePoints[i], 0).x;
            if (selection != 0) {
              break;
            }
          }
        }
      `
    });

    this.selectionPipeline = gpu.device.createComputePipeline({
      label: 'Decal Selection',
      layout: gpu.device.createPipelineLayout({
        bindGroupLayouts: [this.selectionBindGroupLayout],
        // @ts-expect-error TypeScript defs for immediates not available yet.
        immediateSize: Vec2.BYTE_LENGTH,
      }),
      compute: {
        module
      }
    });
  }

  onResize(width: number, height: number) {
    const device = this.gpu.device;

    if (this.selectionTexture) {
      this.selectionTexture.destroy();
    }

    this.selectionTexture = device.createTexture({
      label: 'Decal Selection',
      size: { width, height },
      sampleCount: this.gpu.config.sampleCount,
      format: this.gpu.config.selectionFormat,
      usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING
    });

    this.selectionBindGroup = device.createBindGroup({
      label: 'Decal Selection',
      layout: this.selectionBindGroupLayout,
      entries: [{
        binding: 0,
        resource: this.selectionTexture,
      }, {
        binding: 1,
        resource: this.selectionBuffer
      }]
    });
  }

  #getSelectionReadbackBuffer(): GPUBuffer {
    if (this.selectionReadbackBuffers.length) {
      return this.selectionReadbackBuffers.pop()!;
    }

    const buffer = this.gpu.device.createBuffer({
      label: 'Decal Selection Readback',
      size: this.selectionBuffer.size,
      usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
    });

    return buffer;
  }

  async getDecalIdAtPoint(x: number, y: number): Promise<number> {
    const device = this.gpu.device;
    // Executes a compute shader to read back the id of the decal that appears at the given X,Y
    // screen-space coordinate.

    const readbackBuffer = this.#getSelectionReadbackBuffer();

    const commandEncoder = device.createCommandEncoder();
    const computePass = commandEncoder.beginComputePass({});

    computePass.setPipeline(this.selectionPipeline);
    computePass.setBindGroup(0, this.selectionBindGroup!);

    this.immediateArray[0] = x;
    this.immediateArray[1] = y;
    // @ts-expect-error TypeScript defs for immediates not available yet.
    computePass.setImmediates(0, this.immediateArray);

    computePass.dispatchWorkgroups(1);

    computePass.end();

    commandEncoder.copyBufferToBuffer(this.selectionBuffer, readbackBuffer);

    device.queue.submit([commandEncoder.finish()]);

    await readbackBuffer.mapAsync(GPUMapMode.READ);
    const selectionArray = new Uint32Array(readbackBuffer.getMappedRange());
    const selection = selectionArray[0];
    readbackBuffer.unmap();
    this.selectionReadbackBuffers.push(readbackBuffer);

    return selection;
  }
}