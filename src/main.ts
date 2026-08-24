import { OrbitCamera } from './common/webgpu/camera/orbit-camera.ts';
import { BoxGeometry } from './common/webgpu/geometries/box.ts';
import { AttribLocation, Geometry } from './common/webgpu/geometry.ts';
import { EmojiRenderer } from './emoji-renderer.ts';
import { WebGPUMipmapGenerator } from './loaders/texture/mipmap-generator.ts';
import { WebGpuTextureLoader } from './loaders/texture/webgpu-texture-loader.ts';
import { WebGPUApp, WebGPURenderer } from './webgpu-renderer.ts';
import { Stage } from './common/stage.ts';
import { Actor } from './common/actor.ts';
import { UnlitMaterial } from './common/webgpu/materials/unlit.ts';
import { SphereGeometry } from './common/webgpu/geometries/sphere.ts';
import { CylinderGeometry } from './common/webgpu/geometries/cylinder.ts';
import { ConeGeometry } from './common/webgpu/geometries/cone.ts';

const EMOJI_SIZE = 256;

(function main() {
  WebGPUApp.Begin(class extends WebGPUApp {
    emojiButton: HTMLButtonElement;
    emojiPicker: HTMLElement;
    emojiRenderer: EmojiRenderer;
    textureLoader: WebGpuTextureLoader;

    emojiSampler: GPUSampler;
    currentEmojiTexture?: GPUTexture;
    currentEmojiBindGroup?: GPUBindGroup;

    stage: Stage = new Stage();
    box: Actor;

    shapes: Actor[] = [];

    camera: OrbitCamera;

    constructor(gpu: WebGPURenderer) {
      super(gpu);

      const geometries = [
        new Geometry(gpu.device, new BoxGeometry()),
        new Geometry(gpu.device, new SphereGeometry()),
        new Geometry(gpu.device, new CylinderGeometry()),
        new Geometry(gpu.device, new ConeGeometry()),
      ];

      const materials = [
        new UnlitMaterial(gpu.device, { baseColorFactor: [1, 0, 0, 1] }),
        new UnlitMaterial(gpu.device, { baseColorFactor: [0, 1, 0, 1] }),
        new UnlitMaterial(gpu.device, { baseColorFactor: [0, 0, 1, 1] }),
        new UnlitMaterial(gpu.device, { baseColorFactor: [1, 1, 0, 1] }),
        new UnlitMaterial(gpu.device, { baseColorFactor: [1, 0, 1, 1] }),
        new UnlitMaterial(gpu.device, { baseColorFactor: [0, 1, 1, 1] }),
      ];

      this.box = new Actor(
        geometries[0],
        materials[0]
      );
      this.stage.attachChild(this.box);

      for (let i = 0; i < 100; ++i) {
        const actor = new Actor(
          geometries[Math.floor(Math.random() * geometries.length)],
          materials[Math.floor(Math.random() * materials.length)]
        );

        actor.transform.translation = [Math.random() * 100, Math.random() * 100, Math.random() * 100];
        actor.transform.scale = [Math.random() + 0.5, Math.random() + 0.5, Math.random() + 0.5];
        actor.transform.rotationRef.rotateX(Math.random() * Math.PI);
        actor.transform.rotationRef.rotateY(Math.random() * Math.PI);

        this.shapes.push(actor);

        this.stage.attachChild(actor);
      }

      this.camera = new OrbitCamera(gpu.canvas);
      this.camera.distance = 4;

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

      const emojiMaterial = new UnlitMaterial(this.gpu.device, {
        baseColorFactor: [Math.random(), Math.random(), Math.random(), 1],
        baseColorTexture: this.currentEmojiTexture,
      });
      this.box.add(emojiMaterial);

      this.currentEmojiBindGroup = this.gpu.device.createBindGroup({
        layout: this.gpu.unlitPipelineFactory.materialBGL,
        entries: [{
          binding: 0,
          resource: emojiMaterial.uniformBuffer,
        }, {
          binding: 1,
          resource: this.currentEmojiTexture,
        }, {
          binding: 2,
          resource: this.emojiSampler,
        }]
      });
    }

    onFrame(gpu: WebGPURenderer, timestamp: number, delta: number) {
      gpu.render(this.stage, this.camera, timestamp);

      /*if (this.currentEmojiBindGroup) {
        renderPass.setBindGroup(0, this.cameraBindGroup);
        renderPass.setBindGroup(1, this.currentEmojiBindGroup);
        this.unlitPipeline.use(renderPass);

        const boxGeometry = this.box.get(Geometry)!;
        boxGeometry.bindAndDraw(renderPass);
        //renderPass.draw(6);
      }*/
    }
  }, {
    canvas: document.querySelector('#webgpu-canvas') as HTMLCanvasElement
  });
})();
