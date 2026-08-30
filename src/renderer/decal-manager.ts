import { Mat4, Vec4 } from "gl-matrix";
import { Actor } from "../core/actor.ts";
import { Geometry } from "../geometry/geometry.ts";
import { MaterialBase } from "../materials/material-base.ts";
import { WebGPURenderer } from "./webgpu-renderer.ts";
import { Decal } from "../materials/decal.ts";
import { Stage } from "../core/stage.ts";

function nextMultipleOf(multiple: number, value: number): number {
  return Math.ceil(value / multiple) * multiple;
}

const MAX_DECALS = 1024;
const DECAL_BYTE_SIZE = Mat4.BYTE_LENGTH + Vec4.BYTE_LENGTH;

export class DecalManager {
  gpu: WebGPURenderer;

  decalBGL: GPUBindGroupLayout;
  decalBindGroup?: GPUBindGroup;

  decalArray = new ArrayBuffer(DECAL_BYTE_SIZE * MAX_DECALS + Vec4.BYTE_LENGTH);
  decalUintArray = new Uint32Array(this.decalArray);
  decalFloatArray = new Float32Array(this.decalArray);
  decalBuffer: GPUBuffer;

  constructor(gpu: WebGPURenderer) {
    this.gpu = gpu;

    this.decalBGL = gpu.device.createBindGroupLayout({
      label: 'Decal',
      entries: [{
        binding: 0,
        visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
        buffer: { type: 'read-only-storage' }
      }, {
        binding: 1,
        visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
        texture: {}
      }, {
        binding: 2,
        visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
        sampler: {}
      }]
    });

    this.decalBuffer = gpu.device.createBuffer({
      label: 'Decal',
      size: this.decalArray.byteLength,
      usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.STORAGE,
    });
  }

  updateDecals(stage: Stage) {
    const textureProj = new Mat4();
    let texture: GPUTexture | undefined;
    let offset = 4;
    let decalCount = 0;
    stage.query(Decal).forEach((actor: Actor, decal: Decal) => {
      Mat4.invert(textureProj, actor.worldTransform.matrix);
      Mat4.multiply(textureProj, decal.projection, textureProj);

      this.decalUintArray[offset] = 2; // Texture index
      this.decalFloatArray.set(textureProj, offset+4);

      texture = decal.texture;

      offset += 20;
      decalCount++;
    });

    if (!texture) {
      return;
    }

    this.decalUintArray[0] = decalCount;

    // Update camera uniforms
    this.gpu.device.queue.writeBuffer(this.decalBuffer, 0, this.decalArray, 0, DECAL_BYTE_SIZE * decalCount + Vec4.BYTE_LENGTH);

    this.decalBindGroup = this.gpu.device.createBindGroup({
      label: 'Decal',
      layout: this.decalBGL,
      entries: [{
        binding: 0,
        resource: this.decalBuffer,
      }, {
        binding: 1,
        resource: texture,
      }, {
        binding: 2,
        resource: this.gpu.defaultSampler,
      }]
    })
  }
}