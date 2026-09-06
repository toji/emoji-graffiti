/**
 * This library offers a unified way of loading textures for WebGPU from various file formats, and in all cases attempts
 * to handle the loading as efficently as possible. Every effort made to prevent texture loading from blocking the main
 * thread, since that can often be one of the primary causes of jank during page startup or while
 * streaming in new assets.
 */

import { WorkerPool } from '../../util/worker-pool.ts'
import { CacheHelper } from '../../util/cache-helper.ts'

export type WebTexture = GPUTexture;

type TextureDataType = "3d" | "2d" | "cube-array" | "cube" | "2d-array";

export interface WebTextureFormat {
  canGenerateMipmaps?: boolean,
  compressed?: { blockBytes: number, blockWidth: number, blockHeight: number }
}

// Additional format data used by Web Texture Tool, based off WebGPU formats.
export const WebTextureFormats: { [key: string]: WebTextureFormat } = {
  // Uncompressed formats
  'rgb8unorm': { canGenerateMipmaps: true },
  'rgba8unorm': { canGenerateMipmaps: true },
  'rgb8unorm-srgb': { canGenerateMipmaps: true },
  'rgba8unorm-srgb': { canGenerateMipmaps: true },
  'rgb565unorm': { canGenerateMipmaps: true },
  'rgba4unorm': { canGenerateMipmaps: true },
  'rgba5551unorm': { canGenerateMipmaps: true },
  'bgra8unorm': { canGenerateMipmaps: true },
  'bgra8unorm-srgb': { canGenerateMipmaps: true },

  // Floating point textures
  'rg11b10ufloat': { canGenerateMipmaps: false },

  // Compressed formats
  'bc1-rgb-unorm': {
    compressed: {blockBytes: 8, blockWidth: 4, blockHeight: 4},
  },
  'bc2-rgba-unorm': {
    compressed: {blockBytes: 16, blockWidth: 4, blockHeight: 4},
  },
  'bc3-rgba-unorm': {
    compressed: {blockBytes: 16, blockWidth: 4, blockHeight: 4},
  },
  'bc7-rgba-unorm': {
    compressed: {blockBytes: 16, blockWidth: 4, blockHeight: 4},
  },
  'etc1-rgb-unorm': {
    compressed: {blockBytes: 8, blockWidth: 4, blockHeight: 4},
  },
  'etc2-rgba8unorm': {
    compressed: {blockBytes: 16, blockWidth: 4, blockHeight: 4},
  },
  'astc-4x4-rgba-unorm': {
    compressed: {blockBytes: 16, blockWidth: 4, blockHeight: 4},
  },
  'pvrtc1-4bpp-rgb-unorm': {
    compressed: {blockBytes: 8, blockWidth: 4, blockHeight: 4},
  },
  'pvrtc1-4bpp-rgba-unorm': {
    compressed: {blockBytes: 8, blockWidth: 4, blockHeight: 4},
  },
};

const EXTENSION_MIME_TYPES: { [key: string]: string } = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  apng: 'image/apng',
  gif: 'image/gif',
  bmp: 'image/bmp',
  webp: 'image/webp',
  ico: 'image/x-icon',
  cur: 'image/x-icon',
  svg: 'image/svg+xml',
  basis: 'image/basis',
  ktx: 'image/ktx',
  ktx2: 'image/ktx2',
  dds: 'image/vnd.ms-dds',
  hdr: 'image/vnd.radiance',
  none: '',
};

interface TextureBufferView {
  levelSize: GPUExtent3DDict,
  level: number,
  layer: number,
  face: number,
  byteOffset: number,
  byteLength: number,
}

export interface TextureData {
  type: TextureDataType,
  format: GPUTextureFormat,
  size: GPUExtent3DDict,
  mipLevelCount: number,
  bufferViews: TextureBufferView[],
  arrayBuffer: ArrayBuffer,
}

class BasicTextureData implements TextureData {
  type: TextureDataType = '2d';
  format: GPUTextureFormat;
  size: GPUExtent3DDict;
  arrayBuffer: ArrayBuffer;
  mipLevelCount: number;
  bufferViews: TextureBufferView[] = [];

  constructor(format: GPUTextureFormat, width: number, height: number, imageData: ArrayBufferView<ArrayBuffer>) {
    this.format = format;
    this.size = { width: Math.max(1, width), height: Math.max(1, height) };
    this.mipLevelCount = 0;
    this.arrayBuffer = imageData.buffer;
    this.bufferViews = [{
      levelSize: this.size,
      level: 0,
      layer: 0,
      face: 0,
      byteOffset: imageData.byteOffset,
      byteLength: imageData.byteLength,
    }]
  }
}

export interface TextureClient {
  supportedFormats(): string[];
  fromImageBitmapBlob(blob: Blob, format: GPUTextureFormat, options: any): Promise<WebTexture>;
  fromTextureData(textureData: TextureData, options: any): WebTexture;
  destroy(): void;
}

export interface TextureLoader {
  fromBlob(client: TextureClient, blob: Blob, options: any): Promise<WebTexture>;
  fromBuffer(client: TextureClient, buffer: ArrayBuffer|ArrayBufferView, options: any): Promise<WebTexture>;
}

type TextureLoaderCallback = () => TextureLoader;

/**
 * Associates a set of extensions with a specifc loader.
 */
class ExtensionHandler {
  mimeTypes: string[];
  callback: TextureLoaderCallback;
  loader?: TextureLoader = undefined;
  /**
   * Creates an ExtensionHandler.
   *
   * @param {Array<string>} extensions - List of extensions that this loader can handle.
   * @param {Function} callback - Callback which returns an instance of the loader.
   */
  constructor(mimeTypes: string[], callback: TextureLoaderCallback) {
    this.mimeTypes = mimeTypes;
    this.callback = callback;
  }

  /**
   * Gets the loader associated with this extension set. Creates an instance by calling the callback if one hasn't been
   * instantiated previously.
   *
   * @returns {object} Texture Loader instance.
   */
  getLoader(): TextureLoader {
    if (!this.loader) {
      this.loader = this.callback();
    }
    return this.loader;
  }
}

/**
 * Loader which handles any image types supported directly by the browser.
 */
export class ImageLoader implements TextureLoader {
  static supportedMIMETypes() : string[] {
    return [
      'image/jpeg',
      'image/png',
      'image/apng',
      'image/gif',
      'image/bmp',
      'image/webp',
      'image/x-icon',
      'image/svg+xml',
    ];
  }

  async fromBlob(client: TextureClient, blob: Blob, options: WebTextureOptions): Promise<WebTexture> {
    return client.fromImageBitmapBlob(blob, 'rgba8unorm', options);
  }

  async fromBuffer(client: TextureClient, buffer: ArrayBuffer|ArrayBufferView<ArrayBuffer>, options: WebTextureOptions): Promise<WebTexture> {
    const blob = new Blob([buffer], {type: options.mimeType});
    return this.fromBlob(client, blob, options);
  }
}

/**
 * Loader which defers it's work to a worker pool.
 */
export class WorkerLoader extends WorkerPool {
  /**
   * Creates a WorkerLoader instance.
   *
   * @param relativeWorkerPath - Path to the worker script to load, relative to this file.
   */
  constructor(relativeWorkerPath: string) {
    super(relativeWorkerPath);
  }

  async fromBlob(client: TextureClient, blob: Blob, options: any): Promise<WebTexture> {
    const arrayBuffer = await blob.arrayBuffer();

    const textureData = await this.dispatch({
      arrayBuffer,
      supportedFormats: client.supportedFormats(),
      mipmaps: options.mipmaps,
      extension: options.extension
    }, [arrayBuffer]);

    return client.fromTextureData(textureData as TextureData, options);
  }

  async fromBuffer(client: TextureClient, arrayBuffer: ArrayBuffer|ArrayBufferView, options: any): Promise<WebTexture> {
    const textureData = await this.dispatch({
      arrayBuffer,
      supportedFormats: client.supportedFormats(),
      mipmaps: options.mipmaps,
      extension: options.extension
    }); // TODO: Option to transfer buffer

    return client.fromTextureData(textureData as TextureData, options);
  }
}

const EXTENSION_HANDLERS = [
  new ExtensionHandler(ImageLoader.supportedMIMETypes(), () => new ImageLoader()),
  new ExtensionHandler(['image/ktx', 'image/ktx2'], () => new WorkerLoader('ktx/ktx-worker.js')),
];

const TMP_ANCHOR = document.createElement('a');

const DEFAULT_URL_OPTIONS: WebTextureOptions = {
  mimeType: undefined,
  mipmaps: true,
  colorSpace: 'linear',
};

export type WebTextureColorSpace = 'linear' | 'sRGB';

export interface WebTextureOptions {
  mimeType?: string;
  cacheUrl?: string;
  filename?: string;
  mipmaps?: boolean;
  colorSpace?: WebTextureColorSpace;
}

function resolveMimeType(filename?: string, mimeType?: string): string | undefined {
  if (mimeType && mimeType != 'application/octet-stream') {
    return mimeType;
  }

  if (filename) {
    const extIndex = filename.lastIndexOf('.');
    const extension = extIndex > -1 ? filename.substring(extIndex+1).toLowerCase() : 'none';
    mimeType = EXTENSION_MIME_TYPES[extension];
    if (!mimeType) {
      throw new Error(`Could not predict MIME type from filename "${filename}" with extension of "${extension}".`);
    }
  }

  return mimeType;
}

function getMimeTypeLoader(handlers: any, mimeType?: string) {
  if (!mimeType) {
    throw new Error('A valid MIME type must be specified.');
  }

  let typeHandler = handlers[mimeType];
  if (!typeHandler) {
    typeHandler = handlers['*'];
  }

  // Get the appropriate loader for the extension. Will instantiate the loader instance the first time it's
  // used.
  const loader = typeHandler.getLoader();
  if (!loader) {
    throw new Error(`Failed to get loader for MIME type "${mimeType}"`);
  }
  return loader;
}

// Wraps a TextureClient to cache any results sent to it.
class CachingClient implements TextureClient {
  #client: TextureClient;
  #imageCache: CacheHelper;

  constructor(client: TextureClient, imageCache: Cache) {
    this.#client = client;
    this.#imageCache = new CacheHelper(imageCache);
  }

  async loadFromCache(uri: string, textureOptions: WebTextureOptions): Promise<WebTexture> {
    const image = await this.#imageCache.getMulti(uri);
    if (image) {
      const metadata = image.metadata as any;
      if (metadata['type'] === 'imageBitmap') {
        return this.#client.fromImageBitmapBlob(image.blob as Blob, metadata['format'], textureOptions);
      } else {
        const textureData: TextureData = {
          ...metadata as TextureData,
          arrayBuffer: image.arrayBuffer as ArrayBuffer,
        };
        return this.#client.fromTextureData(textureData, textureOptions);
      }
    }
    throw new Error('Image not in Cache');
  }

  supportedFormats(): string[] {
    return this.#client.supportedFormats();
  }

  fromImageBitmapBlob(blob: Blob, format: GPUTextureFormat, options: WebTextureOptions): Promise<WebTexture> {
    if (options.cacheUrl) {
      const metadata = {
        type: 'imageBitmap',
        format,
      };

      this.#imageCache.setMulti(options.cacheUrl, {
        metadata,
        blob
      });
    }

    return this.#client.fromImageBitmapBlob(blob, format, options);
  }

  fromTextureData(textureData: any, options: WebTextureOptions): WebTexture {
    if (options.cacheUrl) {
      const metadata = {
        type: 'textureData',
        format: textureData.format,
      };

      this.#imageCache.setMulti(options.cacheUrl, {
        metadata,
        arrayBuffer: textureData.arrayBuffer
      });
    }

    return this.#client.fromTextureData(textureData, options);
  }

  destroy(): void {
    this.#client.destroy();
  }
}

/**
 * Base texture loader class.
 * Must not be used directly, create an instance of WebGPUTextureLoader instead.
 */
export class TextureLoaderBase {
  #client?: TextureClient;
  #cachingClient?: CachingClient;
  #handlers: { [key: string]: ExtensionHandler } = {};

  /**
   * Must not be called by applications directly.
   * Create an instance of WebGPUTextureLoader instead.
   *
   * @param {object} client - The TextureClient which will upload the texture data to the GPU.
   */
  constructor(client: TextureClient, imageCache?: Cache) {
    // If an imageCache is provided, wrap the client in a CachingClient that will cache the
    // intermediate results
    if (imageCache) {
      this.#client = this.#cachingClient = new CachingClient(client, imageCache);
    } else {
      this.#client = client;
    }

    // Map every available extension to it's associated handler
    for (const extensionHandler of EXTENSION_HANDLERS) {
      for (const mimeType of extensionHandler.mimeTypes) {
        this.#handlers[mimeType] = extensionHandler;
      }
    }

    // Register one last "fallback" extension. Anything that we receive that has an unrecognized extension will try to
    // load with the ImageTextureLoader.
    this.#handlers['*'] = EXTENSION_HANDLERS[0];
  }

  get isCaching(): boolean {
    return this.#cachingClient != null;
  }

  /** Loads a texture from the given URL
   *
   * @param url - URL of the file to load.
   * @param textureOptions - Options for how the loaded texture should be handled.
   * @returns Promise which resolves to the completed WebTextureResult.
   */
  async fromUrl(url: string, textureOptions: WebTextureOptions = {}): Promise<WebTexture> {
    if (!this.#client) {
      throw new Error('Cannot create new textures after object has been destroyed.');
    }

    // Use this to resolve to a full URL.
    TMP_ANCHOR.href = url;

    // Check to see if the image is in the cache first
    if (this.#cachingClient) {
      try {
        const cachedTexture = await this.#cachingClient.loadFromCache(TMP_ANCHOR.href, textureOptions);
        if (cachedTexture) {
          return cachedTexture;
        }
      } catch {
        // Cache fail. Ignore error, load image as usaual.
      }
    }

    // Image not in cache, load it normally. Always load URLs as Blobs.
    textureOptions.cacheUrl = TMP_ANCHOR.href;
    textureOptions.filename = TMP_ANCHOR.href;
    const response = await fetch(TMP_ANCHOR.href);
    const blob = await response.blob();
    return this.fromBlob(blob, textureOptions);
  }

  /** Loads a texture from the given blob
   *
   * @param blob - Blob containing the texture file data.
   * @param textureOptions - Options for how the loaded texture should be handled.
   * @returns Promise which resolves to the completed WebTextureResult.
   */
  async fromBlob(blob: Blob, textureOptions: WebTextureOptions = {}): Promise<WebTexture> {
    if (!this.#client) {
      throw new Error('Cannot create new textures after object has been destroyed.');
    }

    const options = Object.assign({}, DEFAULT_URL_OPTIONS, textureOptions);

    const mimeType = resolveMimeType(options.filename, options.mimeType ?? blob.type);
    const loader = getMimeTypeLoader(this.#handlers, mimeType);
    return loader.fromBlob(this.#client, blob, options);
  }

  /** Loads a texture from the given blob
   *
   * @param buffer - Buffer containing the texture file data.
   * @param textureOptions - Options for how the loaded texture should be handled.
   * @returns Promise which resolves to the completed WebTextureResult.
   */
  async fromBuffer(buffer: ArrayBuffer|ArrayBufferView, textureOptions: WebTextureOptions = {}): Promise<WebTexture> {
    if (!this.#client) {
      throw new Error('Cannot create new textures after object has been destroyed.');
    }

    const options = Object.assign({}, DEFAULT_URL_OPTIONS, textureOptions);

    const mimeType = resolveMimeType(options.filename, options.mimeType);
    const loader = getMimeTypeLoader(this.#handlers, mimeType);
    return loader.fromBuffer(this.#client, buffer, options);
  }

  /**
   * Creates a 1x1 texture with the specified color.
   *
   * @param r - Red channel value
   * @param g - Green channel value
   * @param b - Blue channel value
   * @param a - Alpha channel value
   * @param format - Format to create the texture with
   * @returns Completed WebTextureResult
   */
  fromColor(r: number, g: number, b: number, a: number = 1.0, format: GPUTextureFormat = 'rgba8unorm'): WebTexture {
    if (!this.#client) {
      throw new Error('Cannot create new textures after object has been destroyed.');
    }
    if (format != 'rgba8unorm' && format != 'rgba8unorm-srgb') {
      throw new Error('fromColor only supports "rgba8unorm" and "rgba8unorm-srgb" formats');
    }
    const data = new Uint8Array([r * 255, g * 255, b * 255, a * 255]);
    return this.#client.fromTextureData(new BasicTextureData(format, 1, 1, data), false);
  }

  /**
   * Creates a noise texture with the specified dimensions. (rgba8unorm format)
   *
   * @param width - Width of the noise texture
   * @param height - Height of the noise texture
   * @returns Completed WebTextureResult
   */
   fromNoise(width: number, height: number): WebTexture {
    // TODO: Better noise, more noise varieties, and more texture formats.

    if (!this.#client) {
      throw new Error('Cannot create new textures after object has been destroyed.');
    }
    const data = new Uint8Array(width * height * 4);
    for (let i = 0; i < data.length; ++i) {
      data[i] = Math.random() * 255;
    }
    return this.#client.fromTextureData(new BasicTextureData('rgba8unorm', width, height, data), false);
  }

  /**
   * Destroys the texture tool and stops any in-progress texture loads that have been started.
   */
  destroy() {
    if (this.#client) {
      this.#client.destroy();
      this.#client = undefined;
    }
  }
}
