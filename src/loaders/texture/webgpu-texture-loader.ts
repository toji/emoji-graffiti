/**
 * Supports loading textures for WebGPU, as well as providing common utilities that are not part of the core WebGPU API
 * such as mipmap generation.
 */

import { WebGPUMipmapGenerator } from './mipmap-generator.ts';
import {
  TextureLoaderBase,
  TextureClient,
  WebTexture,
  WebTextureOptions,
  WebTextureFormats
} from './texture-loader-base.ts';


const EXTENSION_FORMATS: { [key: string]: GPUTextureFormat[] } = {
  'texture-compression-bc': [
    'bc1-rgba-unorm',
    'bc2-rgba-unorm',
    'bc3-rgba-unorm',
    'bc7-rgba-unorm',
  ],
  'texture-compression-etc2': [
    'etc2-rgb8unorm',
    'etc2-rgb8a1unorm',
    'etc2-rgba8unorm',
    'eac-r11unorm',
    'eac-r11snorm',
    'eac-rg11unorm',
    'eac-rg11snorm',
  ],
  'texture-compression-astc': [
    'astc-4x4-unorm',
    'astc-5x4-unorm',
    'astc-5x5-unorm',
    'astc-6x5-unorm',
    'astc-6x6-unorm',
    'astc-8x5-unorm',
    'astc-8x6-unorm',
    'astc-8x8-unorm',
    'astc-10x5-unorm',
    'astc-10x6-unorm',
    'astc-10x8-unorm',
    'astc-10x10-unorm',
    'astc-12x10-unorm',
    'astc-12x12-unorm',
  ],
};

function formatForColorSpace(format: GPUTextureFormat, colorSpace?: string): GPUTextureFormat {
  switch (colorSpace) {
    case 'sRGB':
      return `${format}-srgb` as GPUTextureFormat;
    default:
      return format;
  }
}

/**
 * Variant of TextureLoaderBase which produces WebGPU textures.
 */
export class WebGpuTextureLoader extends TextureLoaderBase {
  device: GPUDevice;
  mipmapGenerator: WebGPUMipmapGenerator;

  /**
   * Creates a WebTextureTool instance which produces WebGPU textures.
   *
   * @param {module:External.GPUDevice} device - WebGPU device to create textures with.
   */
  constructor(device: GPUDevice, imageCache?: Cache) {
    const mipmapGenerator = new WebGPUMipmapGenerator(device);
    super(new WebGpuTextureClient(device, mipmapGenerator), imageCache);
    this.device = device;
    this.mipmapGenerator = mipmapGenerator;
  }
}

/**
 * Texture Client that interfaces with WebGPU.
 */
class WebGpuTextureClient implements TextureClient {
  device?: GPUDevice;
  mipmapGenerator: WebGPUMipmapGenerator;

  supportedFormatList = [
    'rgba8unorm',
    'bgra8unorm',
    'rg11b10ufloat',
  ];

  /**
   * Creates a TextureClient instance which uses WebGPU.
   * Should not be called outside of the WebGPUTextureLoader constructor.
   *
   * @param device - WebGPU device to use.
   */
  constructor(device: GPUDevice, mipmapGenerator: WebGPUMipmapGenerator) {
    this.device = device;
    this.mipmapGenerator = mipmapGenerator;

    // Add any other formats that are exposed by WebGPU features.
    const featureList = device.features;
    if (featureList) { // Firefox seems to not support reporting features yet.
      for (const feature in EXTENSION_FORMATS) {
        if (featureList.has(feature)) {
          const formats = EXTENSION_FORMATS[feature];
          this.supportedFormatList.push(...formats);
        }
      }
    }
  }

  /**
   * Returns a list of the WebTextureFormats that this client can support.
   *
   * @returns {Array<module:WebTextureTool.WebTextureFormat>} - List of supported WebTextureFormats.
   */
  supportedFormats() {
    return this.supportedFormatList;
  }

  /**
   * Creates a GPUTexture from the given ImageBitmap.
   *
   * @param imageBitmap - ImageBitmap source for the texture.
   * @param format - Format to store the texture as on the GPU. Must be an
   * uncompressed format.
   * @param generateMipmaps - True if mipmaps are desired.
   * @returns Completed texture and metadata.
   */
  async fromImageBitmapBlob(blob: Blob, format: GPUTextureFormat, options: WebTextureOptions): Promise<WebTexture> {
    if (!this.device) {
      throw new Error('Cannot create new textures after object has been destroyed.');
    }

    const imageBitmap = await createImageBitmap(blob);

    const generateMipmaps = options.mipmaps;
    const mipLevelCount = generateMipmaps ? WebGPUMipmapGenerator.calculateMipLevels(imageBitmap.width, imageBitmap.height) : 1;

    const usage = GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT;

    const textureDescriptor = {
      size: { width: imageBitmap.width, height: imageBitmap.height },
      format: formatForColorSpace(format, options.colorSpace),
      usage,
      mipLevelCount,
    };
    const texture = this.device.createTexture(textureDescriptor);

    this.device.queue.copyExternalImageToTexture({source: imageBitmap}, {texture}, textureDescriptor.size);

    if (generateMipmaps) {
      this.mipmapGenerator.generateMipmap(texture);
    }

    return texture;
  }

  /**
   * Creates a GPUTexture from the given texture level data.
   *
   * @param textureData - Object containing data and layout for each image and
   * mip level of the texture.
   * @param generateMipmaps - True if mipmaps generation is desired. Only applies if a single level is given
   * and the texture format is renderable.
   * @returns Completed texture and metadata.
   */
  fromTextureData(textureData: any, options: WebTextureOptions): WebTexture {
    if (!this.device) {
      throw new Error('Cannot create new textures after object has been destroyed.');
    }

    const wtFormat = WebTextureFormats[textureData.format];
    if (!wtFormat) {
      throw new Error(`Unknown format "${textureData.format}"`);
    }

    const blockInfo = wtFormat.compressed || {blockBytes: 4, blockWidth: 1, blockHeight: 1};
    const generateMipmaps = options.mipmaps && wtFormat.canGenerateMipmaps;

    const mipLevelCount = textureData.mipLevelCount > 1 ? textureData.mipLevelCount :
                            (generateMipmaps ? WebGPUMipmapGenerator.calculateMipLevels(textureData.width, textureData.height) : 1);

    const usage = GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST;

    const textureDescriptor = {
      size: {
        width: Math.ceil(textureData.size.width / blockInfo.blockWidth) * blockInfo.blockWidth,
        height: Math.ceil(textureData.size.height / blockInfo.blockHeight) * blockInfo.blockHeight,
        depthOrArrayLayers: textureData.size.depthOrArrayLayers,
      },
      format: formatForColorSpace(textureData.format, options.colorSpace),
      usage,
      mipLevelCount,
    };
    const texture = this.device.createTexture(textureDescriptor);

    for (const bufferView of textureData.bufferViews) {
      const bytesPerRow = Math.ceil(bufferView.levelSize.width / blockInfo.blockWidth) * blockInfo.blockBytes;

      // TODO: It may be more efficient to upload the mip levels to a buffer and copy to the texture, but this makes
      // the code significantly simpler and avoids an alignment issue I was seeing previously, so for now we'll take
      // the easy route.
      this.device.queue.writeTexture(
        {
          texture: texture,
          mipLevel: bufferView.level,
          origin: {z: bufferView.layer},
        },
        textureData.arrayBuffer,
        {
          offset: bufferView.byteOffset,
          bytesPerRow,
        },
        { // Copy width and height must be a multiple of the format block size;
          width: Math.ceil(bufferView.levelSize.width / blockInfo.blockWidth) * blockInfo.blockWidth,
          height: Math.ceil(bufferView.levelSize.height / blockInfo.blockHeight) * blockInfo.blockHeight,
        });
    }

    if (generateMipmaps) {
      this.mipmapGenerator.generateMipmap(texture);
    }

    return texture;
  }

  /**
   * Destroy this client.
   * The client is unusable after calling destroy().
   *
   * @returns {void}
   */
  destroy(): void {
    this.device = undefined;
  }
}
