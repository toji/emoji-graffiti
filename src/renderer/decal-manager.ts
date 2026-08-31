import { Mat4, Vec4 } from "gl-matrix";
import { Actor, Tag } from "../core/actor.ts";
import { WebGPURenderer } from "./webgpu-renderer.ts";
import { Decal } from "../materials/decal.ts";
import { Stage } from "../core/stage.ts";
import { EmojiRenderer } from "./emoji-renderer.ts";
import { WebGPUMipmapGenerator } from "../loaders/texture/mipmap-generator.ts";
import { Camera } from "../core/camera.ts";

const MAX_DECALS = 1024;
const MAX_DECAL_TEXTURES = 256;
const DECAL_BYTE_SIZE = Mat4.BYTE_LENGTH + Vec4.BYTE_LENGTH;

export class DecalManager {
  gpu: WebGPURenderer;

  emojiRenderer: EmojiRenderer;

  decalBGL: GPUBindGroupLayout;
  decalTextureArray: GPUTexture;
  decalBindGroup?: GPUBindGroup;

  decalArray = new ArrayBuffer(DECAL_BYTE_SIZE * MAX_DECALS + Vec4.BYTE_LENGTH);
  decalUintArray = new Uint32Array(this.decalArray);
  decalFloatArray = new Float32Array(this.decalArray);
  decalBuffer: GPUBuffer;

  nextTextureIndex: number = 0;

  decalKeyMapping: Map<string, number> = new Map();
  decalCache: Decal[] = [];

  constructor(gpu: WebGPURenderer) {
    this.gpu = gpu;

    this.emojiRenderer = new EmojiRenderer(this.gpu.textureLoader);

    this.decalBGL = gpu.device.createBindGroupLayout({
      label: 'Decal',
      entries: [{
        binding: 0,
        visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
        buffer: { type: 'read-only-storage' }
      }, {
        binding: 1,
        visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
        texture: { viewDimension: '2d-array' }
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

    const emojiSize = this.gpu.config.emojiTextureSize;
    this.decalTextureArray = gpu.device.createTexture({
      label: 'Decal',
      size: [emojiSize, emojiSize, MAX_DECAL_TEXTURES], 
      mipLevelCount: WebGPUMipmapGenerator.calculateMipLevels(emojiSize, emojiSize),
      usage: GPUTextureUsage.COPY_DST | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.RENDER_ATTACHMENT,
      format: 'rgba8unorm-srgb',
    });

    this.decalBindGroup = this.gpu.device.createBindGroup({
      label: 'Decal',
      layout: this.decalBGL,
      entries: [{
        binding: 0,
        resource: this.decalBuffer,
      }, {
        binding: 1,
        resource: this.decalTextureArray.createView({
          label: 'Decal',
          dimension: '2d-array'
        }),
      }, {
        binding: 2,
        resource: this.gpu.defaultSampler,
      }]
    });
  }

  #getEmojiKey(emoji: any) {
    return emoji.unicode ?? emoji.emoji?.url;
  }

  async getDecal(emoji: any) {
    const decalKey = this.#getEmojiKey(emoji);

    let decalIndex = this.decalKeyMapping.get(decalKey);
    if (decalIndex !== undefined) {
      return this.decalCache[decalIndex];
    }

    decalIndex = this.nextTextureIndex;
    this.nextTextureIndex = (this.nextTextureIndex + 1) % MAX_DECAL_TEXTURES;

    // Remove any pre-existing Decals at that index
    let decal = this.decalCache[decalIndex];
    if (decal) {
      decal.textureIndex = -1; // Flag that this decal is no longer valid.
      this.decalKeyMapping.delete(this.#getEmojiKey(decal.emoji));
    }

    await this.emojiRenderer.renderEmoji(emoji, this.decalTextureArray, decalIndex);

    decal = new Decal(emoji, decalIndex);
    this.decalCache[decalIndex] = decal;
    this.decalKeyMapping.set(decalKey, decalIndex);

    return decal;
  }

  updateDecals(stage: Stage) {
    const textureProj = new Mat4();
    let offset = 4;
    let decalCount = 0;
    stage.query(Decal).forEach((actor: Actor, decal: Decal) => {
      // Check if the decal has been invalidated.
      if (decal.textureIndex == -1) {
        actor.remove(Decal);
        return;
      }

      const placing = actor.has(Tag('placing-decal'));

      Mat4.invert(textureProj, actor.worldTransform.matrix);
      Mat4.multiply(textureProj, decal.projection, textureProj);

      this.decalUintArray[offset] = decal.textureIndex; // Texture index
      this.decalFloatArray[offset+1] = placing ? 0.50 : 1.0; // Opacity
      this.decalFloatArray.set(textureProj, offset+4);

      offset += 20;
      decalCount++;
    });

    this.decalUintArray[0] = decalCount;

    // Update camera uniforms
    this.gpu.device.queue.writeBuffer(this.decalBuffer, 0, this.decalArray, 0, DECAL_BYTE_SIZE * decalCount + Vec4.BYTE_LENGTH);
  }
}