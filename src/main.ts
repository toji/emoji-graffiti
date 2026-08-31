import { Stage } from './core/stage.ts';
import { Actor } from './core/actor.ts';
import { WebGPUApp, WebGPURenderer } from './renderer/webgpu-renderer.ts';
import { AppConfig } from './app-config.ts';
import { Config } from './util/config.ts';
import { PerspectiveCamera } from './core/camera.ts';
import { GltfLoader } from './loaders/gltf/gltf-loader.ts';
import { FlyingController } from './controllers/flying-controller.ts';
import { Decal } from './materials/decal.ts';

(function main() {
  WebGPUApp.Begin(class extends WebGPUApp {
    config: AppConfig;

    emojiButton: HTMLButtonElement;
    emojiPicker: HTMLElement;

    emojiSampler: GPUSampler;
    currentEmojiTexture?: GPUTexture;
    currentEmojiBindGroup?: GPUBindGroup;

    stage: Stage = new Stage();
    camera: Actor;
    decal: Actor;

    gltfLoader: GltfLoader;

    constructor(gpu: WebGPURenderer) {
      super(gpu);
      this.config = Config.Create(AppConfig);

      this.gltfLoader = new GltfLoader(gpu);

      this.gltfLoader.loadFromUrl('./media/models/gallery.glb').then((scene: Actor) => {
        this.stage.attachChild(scene);
      }).catch((err) => {
        console.error('Gltf failed to load.', err);
      });

      const controller = new FlyingController(gpu.canvas);
      controller.speed = 0.004;
      this.camera = new Actor(
        new PerspectiveCamera({zNear: 0.01}),
        controller,
      );
      this.camera.transform.translation = [0.2, 1.6, 2];
      this.stage.attachChild(this.camera);

      this.decal = new Actor(
        new Decal(gpu.textureLoader.fromColor(0, 1, 0)),
      );
      this.decal.transform.translation = [0, 0, 0];
      this.camera.attachChild(this.decal);

      // Detach from the camera on right click
      gpu.canvas.addEventListener('contextmenu', (ev) => {
        ev.preventDefault();

        // Lock the current decal instance in place
        const curDecal = this.decal.get(Decal);
        this.decal.transform = this.decal.worldTransform;
        this.stage.attachChild(this.decal);

        // Create a new one
        this.decal = new Actor(curDecal);
        this.camera.attachChild(this.decal);

        return false;
      });

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

      // Initialize WebGPU resources
      this.emojiSampler = gpu.device.createSampler({
        label: 'Emoji',
        addressModeU: 'clamp-to-edge',
        addressModeV: 'clamp-to-edge',
        minFilter: 'linear',
        magFilter: 'linear',
        mipmapFilter: 'linear',
      });

      this.onEmojiPicked(this.config.emoji);
    }

    async onEmojiPicked(emoji: any) {
      console.log(emoji);
      this.config.emoji = emoji;
      this.decal.add(await this.gpu.decalManager.getDecal(emoji));
    }

    onResize(gpu: WebGPURenderer, width: number, height: number): void {
      this.camera.get(PerspectiveCamera)!.aspect = width/height;
    }

    onFrame(gpu: WebGPURenderer, timestamp: number, delta: number) {
      this.stage.tick(timestamp);
      gpu.render(this.stage, this.camera, timestamp);
    }
  }, {
    canvas: document.querySelector('#webgpu-canvas') as HTMLCanvasElement
  });
})();
