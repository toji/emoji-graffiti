import { EmojiRenderer } from './emoji-renderer.ts';
import { WebGPUMipmapGenerator } from './loaders/texture/mipmap-generator.ts';
import { WebGpuTextureLoader } from './loaders/texture/webgpu-texture-loader.ts';
import { WebGPUApp, WebGPURenderer } from './webgpu-renderer.ts';

const EMOJI_SIZE = 256;

const EMOJI_SHADER = /* wgsl */`
  const verts = array<vec2f, 6>(
          vec2f(-1, -1), vec2f(-1, 1), vec2f(1, -1),
          vec2f(1, 1), vec2f(-1, 1), vec2f(1, -1),
        );

  struct VertexOut {
    @builtin(position) pos: vec4f,
    @location(0) texCoord: vec2f,
  };

  @group(0) @binding(0) var emojiTexture: texture_2d<f32>;
  @group(0) @binding(1) var emojiSampler: sampler;

  @vertex
  fn vertMain(@builtin(vertex_index)i: u32) -> VertexOut {
    let pos = vec4f(verts[i] * 0.5, 0, 1);
    let texCoord = vec2f(pos.x, -pos.y) * 2 * 0.5 + 0.5;
    return VertexOut(pos, texCoord);
  }

  @fragment
  fn fragMain(in: VertexOut) -> @location(0) vec4f {
    return textureSample(emojiTexture, emojiSampler, in.texCoord);
    //return vec4f(1, 1, 0, 1);
  }
`;

(function main() {
  WebGPUApp.Begin(class extends WebGPUApp {
    emojiButton: HTMLButtonElement;
    emojiPicker: HTMLElement;
    emojiRenderer: EmojiRenderer;
    textureLoader: WebGpuTextureLoader;

    emojiSampler: GPUSampler;
    emojiPipeline: GPURenderPipeline;
    currentEmojiTexture?: GPUTexture;
    currentEmojiBindGroup?: GPUBindGroup;

    constructor(gpu: WebGPURenderer) {
      super(gpu);

      this.textureLoader = new WebGpuTextureLoader(gpu.device);
      this.emojiRenderer = new EmojiRenderer(this.textureLoader);

      // Initialize the Emoji picker control
      this.emojiPicker = document.querySelector('emoji-picker')!;
      this.emojiPicker.addEventListener('emoji-click', (event: Event) => {
        const emojiEvent = (event as CustomEvent);
        this.onEmojiPicked(emojiEvent.detail);

        if (emojiEvent.detail.unicode) {
          this.emojiButton.innerHTML = emojiEvent.detail.unicode;
          this.emojiButton.style = '';
        } else {
          this.emojiButton.innerHTML = ' ';
          this.emojiButton.style = `background-image: url("${emojiEvent.detail.emoji.url}")`;
        }
      });
      fetch('./media/emoji/custom.json').then(async (result) => {
        // @ts-ignore
        this.emojiPicker.customEmoji = await result.json();
      });

      this.emojiButton = document.querySelector('#emoji-button')!;
      this.emojiButton.addEventListener('click', () => {
        // Toggle the emoji picker.
        if (this.emojiPicker.style.display === 'none') {
          this.emojiPicker.style.display = '';
        } else {
          this.emojiPicker.style.display = 'none';
        }
      });

      // TEMP: Attach the canvas from the EmojiRenderer to the DOM
      this.emojiRenderer.canvas.style.position = 'absolute';
      this.emojiRenderer.canvas.style.right = '0px';
      this.emojiRenderer.canvas.style.zIndex = '1';
      document.body.insertBefore(this.emojiRenderer.canvas, gpu.canvas);

      // Initialize WebGPU resources
      const module = gpu.device.createShaderModule({
        label: 'Emoji',
        code: EMOJI_SHADER,
      })
      this.emojiPipeline = gpu.device.createRenderPipeline({
        label: 'Emoji',
        layout: 'auto',
        vertex: { module },
        fragment: {
          module,
          targets: [{
            format: navigator.gpu.getPreferredCanvasFormat(),
            blend: {
              color: {
                srcFactor: 'one',
                dstFactor: 'one-minus-src-alpha'
              },
              alpha: {
                srcFactor: 'zero',
                dstFactor: 'one',
              }
            }
          }]}
      });

      this.emojiSampler = gpu.device.createSampler({
        label: 'Emoji',
        addressModeU: 'clamp-to-edge',
        addressModeV: 'clamp-to-edge',
        minFilter: 'linear',
        magFilter: 'linear',
        mipmapFilter: 'linear',
      });
    }

    async onEmojiPicked(emoji: any) {
      console.log(emoji);

      const texture = this.gpu.device.createTexture({
        //label: `Emoji '${emoji.unicode}'`,
        size: [EMOJI_SIZE, EMOJI_SIZE, 1],
        mipLevelCount: WebGPUMipmapGenerator.calculateMipLevels(EMOJI_SIZE, EMOJI_SIZE),
        format: 'rgba8unorm',
        usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT
      });

      await this.emojiRenderer.renderEmoji(emoji, texture);

      if (this.currentEmojiTexture) {
        this.currentEmojiTexture.destroy();
      }

      this.currentEmojiTexture = texture;
      this.currentEmojiBindGroup = this.gpu.device.createBindGroup({
        layout: this.emojiPipeline.getBindGroupLayout(0),
        entries: [{
          binding: 0,
          resource: this.currentEmojiTexture,
        }, {
          binding: 1,
          resource: this.emojiSampler,
        }]
      })
    }

    onFrame(gpu: WebGPURenderer, timestamp: number, delta: number) {
      const colorTexture = gpu.context.getCurrentTexture();

      const commandEncoder = gpu.device.createCommandEncoder();
      const renderPass = commandEncoder.beginRenderPass({
        colorAttachments: [{
          view: colorTexture,
          loadOp: 'clear',
          clearValue: [0, Math.sin(timestamp / 1000), 1, 1],
          storeOp: 'store',
        }],
      });

      if (this.currentEmojiBindGroup) {
        renderPass.setBindGroup(0, this.currentEmojiBindGroup);
        renderPass.setPipeline(this.emojiPipeline);
        renderPass.draw(6);
      }

      renderPass.end();
      gpu.device.queue.submit([commandEncoder.finish()]);
    }
  }, {
    canvas: document.querySelector('#webgpu-canvas') as HTMLCanvasElement
  });
})();
