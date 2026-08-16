import { Mat4 } from 'gl-matrix';
import { OrbitCamera } from './common/webgpu/camera/orbit-camera.ts';
import { BoxGeometry } from './common/webgpu/geometries/box-geometry.ts';
import { AttribLocation, Geometry } from './common/webgpu/geometry.ts';
import { EmojiRenderer } from './emoji-renderer.ts';
import { WebGPUMipmapGenerator } from './loaders/texture/mipmap-generator.ts';
import { WebGpuTextureLoader } from './loaders/texture/webgpu-texture-loader.ts';
import { WebGPUApp, WebGPURenderer } from './webgpu-renderer.ts';

const EMOJI_SIZE = 256;

const EMOJI_SHADER = /* wgsl */`
  struct VertexIn {
    @location(${AttribLocation.position}) pos: vec4f,
    @location(${AttribLocation.texcoord0}) texCoord: vec2f,
  };

  struct VertexOut {
    @builtin(position) pos: vec4f,
    @location(0) texCoord: vec2f,
  };

  struct Camera {
    projection: mat4x4f,
    view: mat4x4f,
  };

  @group(0) @binding(0) var<uniform> camera: Camera;

  @group(1) @binding(0) var emojiTexture: texture_2d<f32>;
  @group(1) @binding(1) var emojiSampler: sampler;

  @vertex
  fn vertMain(in: VertexIn) -> VertexOut {
    let pos = camera.projection * camera.view * in.pos;
    let texCoord = in.texCoord;
    return VertexOut(pos, texCoord);
  }

  @fragment
  fn fragMain(in: VertexOut) -> @location(0) vec4f {
    let color = textureSample(emojiTexture, emojiSampler, in.texCoord);
    return vec4(color.rgb, 1.0);
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
    cameraBindGroup: GPUBindGroup;
    currentEmojiBindGroup?: GPUBindGroup;

    projection = new Mat4();
    camera: OrbitCamera;
    box: Geometry;
    cameraBuffer: GPUBuffer;

    constructor(gpu: WebGPURenderer) {
      super(gpu);

      this.camera = new OrbitCamera(gpu.canvas);
      this.camera.distance = 4;
      this.box = new Geometry(gpu.device, { ...new BoxGeometry(), vertexUsage: GPUBufferUsage.VERTEX | GPUBufferUsage.STORAGE });

      this.cameraBuffer = gpu.device.createBuffer({
        label: 'Camera',
        size: Mat4.BYTE_LENGTH * 2,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
      });

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
      });
      this.emojiPipeline = gpu.device.createRenderPipeline({
        label: 'Emoji',
        layout: 'auto',
        vertex: { module, buffers: this.box.layout.buffers },
        depthStencil: {
          format: gpu.depthStencilFormat,
          depthWriteEnabled: true,
          depthCompare: 'less',
        },
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

      this.cameraBindGroup = gpu.device.createBindGroup({
        label: 'Camera',
        layout: this.emojiPipeline.getBindGroupLayout(0),
        entries: [{
          binding: 0,
          resource: this.cameraBuffer,
        }]
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
        layout: this.emojiPipeline.getBindGroupLayout(1),
        entries: [{
          binding: 0,
          resource: this.currentEmojiTexture,
        }, {
          binding: 1,
          resource: this.emojiSampler,
        }]
      })
    }

    onResize(gpu: WebGPURenderer, width: number, height: number): void {
      super.onResize(gpu, width, height);
      this.projection.perspectiveZO(Math.PI * 0.5, width/height, 0.1, 16);
    }

    onFrame(gpu: WebGPURenderer, timestamp: number, delta: number) {
      // Update camera uniforms
      gpu.device.queue.writeBuffer(this.cameraBuffer, 0, this.projection);
      gpu.device.queue.writeBuffer(this.cameraBuffer, Mat4.BYTE_LENGTH, this.camera.viewMatrix);

      const colorTexture = gpu.context.getCurrentTexture();

      const commandEncoder = gpu.device.createCommandEncoder();
      const renderPass = commandEncoder.beginRenderPass({
        colorAttachments: [{
          view: colorTexture,
          loadOp: 'clear',
          clearValue: [0, Math.sin(timestamp / 1000), 1, 1],
          storeOp: 'store',
        }],
        depthStencilAttachment: {
          view: gpu.depthStencilTexture!,
          depthLoadOp: 'clear',
          depthClearValue: 1,
          depthStoreOp: 'discard',
        }
      });

      if (this.currentEmojiBindGroup) {
        renderPass.setBindGroup(0, this.cameraBindGroup);
        renderPass.setBindGroup(1, this.currentEmojiBindGroup);
        renderPass.setPipeline(this.emojiPipeline);
        this.box.bindAndDraw(renderPass);
        //renderPass.draw(6);
      }

      renderPass.end();
      gpu.device.queue.submit([commandEncoder.finish()]);
    }
  }, {
    canvas: document.querySelector('#webgpu-canvas') as HTMLCanvasElement,
    depthStencilFormat: 'depth24plus'
  });
})();
