import { Stage } from './core/stage.ts';
import { Actor, Tag } from './core/actor.ts';
import { WebGPUApp, WebGPURenderer } from './renderer/webgpu-renderer.ts';
import { AppConfig } from './app-config.ts';
import { Config } from './util/config.ts';
import { PerspectiveCamera } from './core/camera.ts';
import { GltfLoader } from './loaders/gltf/gltf-loader.ts';
import { FlyingController } from './controllers/flying-controller.ts';
import { Decal } from './materials/decal.ts';
import { AudioPlayer } from './audio-player.ts';

import { Pane } from 'tweakpane';

enum InputMode {
  View,
  Paint,
  Erase,
  Shoot,
};

(function main() {
  WebGPUApp.Begin(class extends WebGPUApp {
    config: AppConfig;

    pane: Pane;

    viewButton: HTMLButtonElement = document.querySelector('#view-button')!;
    emojiButton: HTMLButtonElement = document.querySelector('#emoji-button')!;
    eraseButton: HTMLButtonElement = document.querySelector('#erase-button')!;
    clearButton: HTMLButtonElement = document.querySelector('#clear-button')!;

    emojiPicker: HTMLElement = document.querySelector('emoji-picker')!;
    decalRotationInput: HTMLInputElement = document.querySelector('#decalRotation')!;
    decalRotation: number = 0;

    currentEmojiTexture?: GPUTexture;
    currentEmojiBindGroup?: GPUBindGroup;

    stage: Stage = new Stage();
    camera: Actor;
    decal: Actor;
    spraycan: Actor;
    sponge: Actor;
    paintballGun: Actor;

    gltfLoader: GltfLoader;

    mode: InputMode = InputMode.View;

    audioPlayer: AudioPlayer = new AudioPlayer();
    sprayClips = this.audioPlayer.loadClip('./media/sounds/spray.mp3').subClips([
      { offset: 0.2, duration: 0.5},
      { offset: 1.6, duration: 0.8},
      { offset: 4, duration: 0.5},
    ]);

    eraseClips = this.audioPlayer.loadClip('./media/sounds/erase.mp3').subClips([
      { offset: 0.5, duration: 0.5},
      { offset: 1.75, duration: 0.5},
      { offset: 2.9, duration: 0.5},
      { offset: 4.2, duration: 0.5},
    ]);

    constructor(gpu: WebGPURenderer) {
      super(gpu);
      this.config = Config.Create(AppConfig);

      this.pane = new Pane({
        title: document.title.split('-')[0],
      });


      this.gltfLoader = new GltfLoader(gpu);
      const actorFromGltf = (url: string): Actor => {
        const actor: Actor = new Actor();
          this.gltfLoader.loadFromUrl(url).then((scene: Actor) => {
            actor.attachChild(scene);
          }).catch((err) => {
            console.error('Gltf failed to load.', err);
          });
        return actor;
      }

      // Load the main scene.
      this.stage.attachChild(actorFromGltf('./media/models/gallery.glb'));

      this.spraycan = actorFromGltf('./media/models/spraypaint_can.glb');
      this.spraycan.transform.translation = [0.25, -0.75, -0.5];
      this.spraycan.transform.rotationRef.rotateY(Math.PI);

      this.sponge = actorFromGltf('./media/models/sponge.glb');
      this.sponge.transform.translation = [0.25, -0.75, -0.5];
      this.sponge.transform.rotationRef.rotateY(Math.PI * -0.33);

      this.paintballGun = actorFromGltf('./media/models/paintball_gun.glb');
      this.paintballGun.transform.translation = [0.3, -0.6, -0.5];
      this.paintballGun.transform.rotationRef.rotateY(Math.PI);

      const controller = new FlyingController(gpu.canvas);
      controller.speed = 0.004;
      this.camera = new Actor(
        new PerspectiveCamera({zNear: 0.01}),
        controller,
      );
      this.camera.transform.translation = [0.2, 1.6, 2];
      this.stage.attachChild(this.camera);

      this.decal = new Actor(
        new Decal({}, 0),
        Tag('placing-decal')
      );
      this.decal.transform.translation = [0, 0, 0];

      this.decalRotationInput.addEventListener('input', (ev) => {
        // @ts-expect-error
        this.decalRotation = this.decalRotationInput.value * (Math.PI / 180);
        this.decal.transform.rotationRef.identity();
        this.decal.transform.rotationRef.rotateZ(this.decalRotation);
      });

      // Detach from the camera on right click
      gpu.canvas.addEventListener('contextmenu', (ev) => {
        ev.preventDefault();

        if (this.mode == InputMode.Paint) {
          // Lock the current decal instance in place
          const curDecal = this.decal.get(Decal);
          if (curDecal) {
            this.audioPlayer.play(this.sprayClips[Math.floor(Math.random() * this.sprayClips.length)]);

            this.decal.remove(Tag('placing-decal'));
            this.decal.transform = this.decal.worldTransform;
            this.stage.attachChild(this.decal);
          }

          // Create a new one decal
          this.decal = new Actor(curDecal, Tag('placing-decal'));
          this.decal.transform.rotationRef.rotateZ(this.decalRotation);

          // Quick cooldown to prevent spamming decals
          setTimeout(() => {
            if (this.mode == InputMode.Paint) {
              this.camera.attachChild(this.decal);
            }
          }, this.config.sprayCooldown);
        } else if (this.mode == InputMode.Erase) {
          // Erase the selected decal
          let decalIndex = 1;
          this.stage.query(Decal).forEach((actor: Actor) => {
            if (decalIndex == this.lastSelectedDecal) {
              this.audioPlayer.play(this.eraseClips[Math.floor(Math.random() * this.eraseClips.length)]);

              actor.parent?.removeChild(actor);
              this.lastSelectedDecal = 0;
              this.gpu.decalManager.selectedDecal = 0;
              return false;
            }
            decalIndex++;
          });
        }

        return false;
      });

      gpu.canvas.addEventListener('click', (ev) => {
        this.emojiPicker.style.display = 'none';
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

      this.viewButton.addEventListener('click', () => {
        this.#switchMode(InputMode.View);
      });

      this.emojiButton.addEventListener('click', () => {
        this.#switchMode(InputMode.Paint);
      });

      this.eraseButton.addEventListener('click', () => {
        this.#switchMode(InputMode.Erase);
      });

      this.clearButton.addEventListener('click', () => {
        this.stage.query(Decal).forEach((actor: Actor) => {
          // Don't remove the decal that we're using to place the next one.
          if (!actor.has(Tag('placing-decal'))) {
            actor.parent?.removeChild(actor);
          }
        });
      });

      this.onEmojiPicked(this.config.emoji);

      this.gpu.canvas.addEventListener('mousemove', async (ev: MouseEvent) => {
        if (this.mode == InputMode.Erase) {
          this.getSelectedDecal(gpu,
            Math.floor(ev.clientX * devicePixelRatio),
            Math.floor(ev.clientY * devicePixelRatio));
        }
      });

      this.#switchMode(InputMode.View);
    }

    #switchMode(mode: InputMode) {
      this.mode = mode;
      this.gpu.decalManager.selectedDecal = 0;

      switch(this.mode) {
        case InputMode.View:
          this.viewButton.classList.add('selected');
          this.emojiButton.classList.remove('selected');
          this.eraseButton.classList.remove('selected');
          this.camera.removeChild(this.decal);
          this.camera.removeChild(this.spraycan);
          this.camera.removeChild(this.sponge);
          this.camera.removeChild(this.paintballGun);
          this.emojiPicker.style.display = 'none';
          break;
        case InputMode.Paint:
          this.viewButton.classList.remove('selected');
          this.emojiButton.classList.add('selected');
          this.eraseButton.classList.remove('selected');
          this.camera.attachChild(this.decal);
          this.camera.attachChild(this.spraycan);
          this.camera.removeChild(this.sponge);
          this.camera.removeChild(this.paintballGun);
          // Toggle the emoji picker.
          if (this.emojiPicker.style.display === 'none') {
            this.emojiPicker.style.display = '';
          } else {
            this.emojiPicker.style.display = 'none';
          }
          break;
        case InputMode.Erase:
          this.viewButton.classList.remove('selected');
          this.emojiButton.classList.remove('selected');
          this.eraseButton.classList.add('selected');
          this.camera.removeChild(this.decal);
          this.camera.removeChild(this.spraycan);
          this.camera.attachChild(this.sponge);
          this.camera.removeChild(this.paintballGun);
          this.emojiPicker.style.display = 'none';
          break;
        case InputMode.Shoot:
          this.viewButton.classList.remove('selected');
          this.emojiButton.classList.remove('selected');
          this.eraseButton.classList.add('selected');
          this.camera.removeChild(this.decal);
          this.camera.removeChild(this.spraycan);
          this.camera.removeChild(this.sponge);
          this.camera.attachChild(this.paintballGun);
          this.emojiPicker.style.display = 'none';
          break;
      }
    }

    async onEmojiPicked(emoji: any) {
      console.log(emoji);
      this.config.emoji = emoji;
      this.decal.add(await this.gpu.decalManager.getDecal(emoji));

      if (emoji.unicode) {
        this.emojiButton.innerHTML = emoji.unicode;
        this.emojiButton.style = '';
      } else {
        this.emojiButton.innerHTML = '&nbsp;';
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
        this.lastSelectedDecal = decalId;
        this.gpu.decalManager.selectedDecal = decalId;
      }

      return decalId;
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
