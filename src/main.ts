import { Stage } from './core/stage.ts';
import { Actor, Tag } from './core/actor.ts';
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
    cleanButton: HTMLButtonElement;

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

      // Load the main scene.
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

      // Load a spraycan model
      this.gltfLoader.loadFromUrl('./media/models/spraycan.glb').then((scene: Actor) => {
        scene.transform.translation = [0.15, -0.35, -0.25];
        scene.transform.scale = [0.1, 0.1, 0.1];
        scene.transform.rotationRef.rotateY(Math.PI);
        this.camera.attachChild(scene);
      }).catch((err) => {
        console.error('Gltf failed to load.', err);
      });

      this.decal = new Actor(
        new Decal({}, 0),
        Tag('placing-decal')
      );
      this.decal.transform.translation = [0, 0, 0];
      this.camera.attachChild(this.decal);

      // Detach from the camera on right click
      gpu.canvas.addEventListener('contextmenu', (ev) => {
        ev.preventDefault();

        // Lock the current decal instance in place
        const curDecal = this.decal.get(Decal);
        if (curDecal) {
          this.decal.remove(Tag('placing-decal'));
          this.decal.transform = this.decal.worldTransform;
          this.stage.attachChild(this.decal);
        }

        // Create a new one
        this.decal = new Actor(curDecal, Tag('placing-decal'));
        this.camera.attachChild(this.decal);

        return false;
      });

      // Initialize the Emoji picker control
      this.emojiPicker = document.querySelector('emoji-picker')!;
      this.emojiPicker.addEventListener('emoji-click', (event: Event) => {
        const emojiEvent = (event as CustomEvent);
        this.onEmojiPicked(emojiEvent.detail);
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

      this.cleanButton = document.querySelector('#clean-button')!;
      this.cleanButton.addEventListener('click', () => {
        this.stage.query(Decal).forEach((actor: Actor) => {
          // Don't remove the decal that we're using to place the next one.
          if (!actor.has(Tag('placing-decal'))) {
            actor.parent?.removeChild(actor);
          }
        });
      });

      this.onEmojiPicked(this.config.emoji);

      this.gpu.canvas.addEventListener('mousemove', (ev: MouseEvent) => {
        this.getSelectedDecal(gpu,
          Math.floor(ev.clientX * devicePixelRatio),
          Math.floor(ev.clientY * devicePixelRatio));
      });
    }

    async onEmojiPicked(emoji: any) {
      console.log(emoji);
      this.config.emoji = emoji;
      this.decal.add(await this.gpu.decalManager.getDecal(emoji));

      if (emoji.unicode) {
        this.emojiButton.innerHTML = emoji.unicode;
        this.emojiButton.style = '';
      } else {
        this.emojiButton.innerHTML = ' ';
        this.emojiButton.style = `background-image: url("${emoji.emoji.url}")`;
      }

      this.emojiPicker.style.display = 'none';
    }

    lastSelectedDecal = 0;
    centerX = 0;
    centerY = 0;
    async getSelectedDecal(gpu: WebGPURenderer, x: number, y: number) {
      const decalId = await gpu.selectionManager.getDecalIdAtPoint(x, y);

      if (decalId != this.lastSelectedDecal) {
        console.log(`New Decal Picked at (${x}, ${y}): ${decalId}`);
        this.lastSelectedDecal = decalId;
        this.gpu.decalManager.selectedDecal = decalId;
      }
    }

    onResize(gpu: WebGPURenderer, width: number, height: number): void {
      this.centerX = Math.floor(width * 0.5);
      this.centerY = Math.floor(height * 0.5);
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
