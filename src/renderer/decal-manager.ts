import { Mat4, Vec4 } from "gl-matrix";
import { Actor, Tag } from "../core/actor.ts";
import { WebGPURenderer } from "./webgpu-renderer.ts";
import { Decal } from "../materials/decal.ts";
import { Stage } from "../core/stage.ts";
import { EmojiRenderer } from "./emoji-renderer.ts";
import { WebGPUMipmapGenerator } from "../loaders/texture/mipmap-generator.ts";

const MAX_DECALS = 2048;
const MAX_DECAL_TEXTURES = 2048;
const DECAL_BYTE_SIZE = Mat4.BYTE_LENGTH + Vec4.BYTE_LENGTH * 3;

export class DecalManager {
  gpu: WebGPURenderer;

  emojiRenderer: EmojiRenderer;

  // For non-bindless support.
  decalTextureArray?: GPUTexture;
  // For bindless support.
  decalTextureSet: GPUTexture[] = [];
  // @ts-expect-error
  decalResourceTable?: GPUResourceTable;

  decalArray = new ArrayBuffer(DECAL_BYTE_SIZE * MAX_DECALS + Vec4.BYTE_LENGTH);
  decalUintArray = new Uint32Array(this.decalArray);
  decalFloatArray = new Float32Array(this.decalArray);
  decalBuffer: GPUBuffer;

  selectedDecal: number = 0;

  nextTextureIndex: number = 0;

  decalKeyMapping: Map<string, number> = new Map();
  decalCache: Decal[] = [];

  maxTextures: number = MAX_DECAL_TEXTURES;

  decalMemory: number = 0;
  decalCount: number = 0;
  decalTextureCount: number = 0;

  constructor(gpu: WebGPURenderer) {
    this.gpu = gpu;

    this.emojiRenderer = new EmojiRenderer(this.gpu.textureLoader);

    this.decalBuffer = gpu.device.createBuffer({
      label: 'Decal',
      size: this.decalArray.byteLength,
      usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.STORAGE,
    });

    if (gpu.useBindless) {
      // @ts-expect-error
      this.decalResourceTable = gpu.device.createResourceTable({
        size: this.maxTextures
      });
    } else {
      this.maxTextures = Math.min(this.maxTextures, gpu.device.limits.maxTextureArrayLayers);

      const emojiSize = this.gpu.config.emojiTextureSize;
      this.decalTextureArray = gpu.device.createTexture({
        label: 'Decal',
        size: [emojiSize, emojiSize, this.maxTextures],
        mipLevelCount: WebGPUMipmapGenerator.calculateMipLevels(emojiSize, emojiSize),
        usage: GPUTextureUsage.COPY_DST | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.RENDER_ATTACHMENT,
        format: 'rgba8unorm-srgb',
      });
      const baseLevelSize = 4 * this.decalTextureArray.width
                              * this.decalTextureArray.height
                              * this.decalTextureArray.depthOrArrayLayers;
      this.decalMemory = baseLevelSize * 1.33; // Base layer + mipmaps
    }
  }

  #getEmojiKey(emoji: any) {
    return emoji.unicode ?? emoji.emoji?.url;
  }

  async getDecal(emoji: any) {
    const decalKey = this.#getEmojiKey(emoji);

    let decalIndex = this.decalKeyMapping.get(decalKey);
    if (decalIndex !== undefined) {
      return this.decalCache[decalIndex].clone();
    }

    let texture: GPUTexture | undefined;
    let layerIndex = 0;
    if (this.gpu.useBindless) {
      if (emoji.emoji.url) {
        try {
          texture = await this.gpu.textureLoader.fromUrl(emoji.emoji.url);
        } catch(err) {
          console.warn(err);
        }
      }
      
      if (texture === undefined) {
        const emojiSize = this.gpu.config.emojiTextureSize;
        texture = this.gpu.device.createTexture({
          label: 'Decal',
          size: [emojiSize, emojiSize, 1],
          mipLevelCount: WebGPUMipmapGenerator.calculateMipLevels(emojiSize, emojiSize),
          usage: GPUTextureUsage.COPY_DST | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.RENDER_ATTACHMENT,
          format: 'rgba8unorm-srgb',
        });
        await this.emojiRenderer.renderEmoji(emoji, texture!, layerIndex);
      }
      const baseLevelSize = 4 * texture.width * texture.height;
      this.decalMemory += baseLevelSize * 1.33; // Base level + mips
      decalIndex = this.decalResourceTable.insert(texture.createView({ usage: GPUTextureUsage.TEXTURE_BINDING }));
      this.decalTextureSet[decalIndex!] = texture;
    } else {
      texture = this.decalTextureArray;
      decalIndex = this.nextTextureIndex;
      layerIndex = decalIndex;
      this.nextTextureIndex = (this.nextTextureIndex + 1) % this.maxTextures;

      // Remove any pre-existing Decals at that index
      const oldDecal = this.decalCache[decalIndex];
      if (oldDecal) {
        oldDecal.textureIndex = -1; // Flag that this decal is no longer valid.
        this.decalKeyMapping.delete(this.#getEmojiKey(oldDecal.emoji));
        this.decalTextureCount--;
      }

      await this.emojiRenderer.renderEmoji(emoji, texture!, layerIndex);
    }

    this.decalTextureCount++;

    const decal = new Decal(emoji, decalIndex!);
    this.decalCache[decalIndex!] = decal;
    this.decalKeyMapping.set(decalKey, decalIndex!);

    return decal.clone();
  }

  getTextureDecal(url: any) {
    const emoji = { emoji: { url } }
    return this.getDecal(emoji);
  }

  updateDecals(stage: Stage) {
    const textureProj = new Mat4();
    let offset = 4;
    this.decalCount = 0;
    stage.query(Decal).forEach((actor: Actor, decal: Decal) => {
      // Check if the decal has been invalidated.
      if (decal.textureIndex == -1) {
        actor.remove(Decal);
        return;
      }

      if (this.decalCount >= MAX_DECALS) {
        return;
      }

      const placing = actor.has(Tag('placing-decal'));
      const selected = (decal.id == this.selectedDecal);

      Mat4.invert(textureProj, actor.worldTransform.matrix);
      Mat4.multiply(textureProj, decal.projection, textureProj);

      this.decalUintArray[offset] = decal.id; // Decal ID
      this.decalUintArray[offset+1] = decal.textureIndex; // Texture index
      this.decalUintArray[offset+2] = placing || selected ? 1 : 0; // Highlight
      this.decalFloatArray.set(decal.baseColorFactor, offset+4); // Base Color + Opacity
      this.decalFloatArray.set(actor.worldTransform.translation, offset+8); // Origin
      this.decalFloatArray.set(textureProj, offset+12); // Projection

      offset += DECAL_BYTE_SIZE / Float32Array.BYTES_PER_ELEMENT;
      this.decalCount++;
    });

    this.decalUintArray[0] = this.decalCount;

    // Update camera uniforms
    this.gpu.device.queue.writeBuffer(this.decalBuffer, 0, this.decalArray, 0, DECAL_BYTE_SIZE * this.decalCount + Vec4.BYTE_LENGTH);
  }
}