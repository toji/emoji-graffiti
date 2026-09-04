import { WebGpuTextureLoader } from "../loaders/texture/webgpu-texture-loader.ts";

export class EmojiRenderer {
  textureLoader: WebGpuTextureLoader;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  fontLoaded: Promise<FontFace[]>;

  constructor(textureLoader: WebGpuTextureLoader) {
    this.textureLoader = textureLoader;
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d')!;

    this.fontLoaded = document.fonts.load('200px "Noto Color Emoji", sans-serif');
  }

  loadCustomEmojiImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => { resolve(img); };
      img.onerror = (err) => { reject(err); }
      img.src = url;
    });
  }

  async renderEmoji(emoji: any, texture: GPUTexture, layer: number = 0) {
    const width = this.canvas.width = texture.width;
    const height = this.canvas.height = texture.height;

    this.ctx.clearRect(0, 0, width, height);

    // Blit the emoji to the 2D canvas
    if (emoji.unicode) {
      await this.fontLoaded;
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.font = `${width * 0.75}px "Noto Color Emoji", sans-serif`;
      this.ctx.fillText(emoji.unicode, width * 0.5, height * 0.55, width);
    } else if (emoji.emoji.url) {
      const img = await this.loadCustomEmojiImage(emoji.emoji.url);
      const aspect = img.naturalWidth / img.naturalHeight;
      const imgWidth = (aspect > 1 ? width : width * aspect);
      const imgHeight = (aspect > 1 ? height / aspect : height);
      this.ctx.drawImage(img, (width - imgWidth) * 0.5, (height - imgHeight) * 0.5, imgWidth, imgHeight);
    }

    // Copy the emoji from the 2D canvas to a WebGPU texture layer
    const device = this.textureLoader.device;
    device.queue.copyExternalImageToTexture({
      source: this.canvas
    }, {
      texture,
      origin: [0, 0, layer],
      premultipliedAlpha: true,
    }, [texture.width, texture.height, 1]);
    this.textureLoader.mipmapGenerator.generateMipmap(texture, layer);
  }
}