import { Stage } from './core/stage.ts';
import { Actor, Tag } from './core/actor.ts';
import { WebGPURenderer } from './renderer/webgpu-renderer.ts';
import { PerspectiveCamera } from './core/camera.ts';
import { GltfLoader } from './loaders/gltf/gltf-loader.ts';
import { Decal } from './materials/decal.ts';
import { AudioPlayer } from './audio/audio-player.ts';

import RAPIER from '@dimforge/rapier3d-compat';
import { StagePhysics } from './physics/stage-physics.ts';
import { Vec4 } from 'gl-matrix';
import { QueryArgs } from './util/query-args.ts';
import { WebGPUApp } from './renderer/webgpu-app.ts';
import { PhysicsFPSController } from './controllers/physics-fps-controller.ts';
import { DebugMenu } from './debug-menu.ts';
import { AppState, InputMode } from './app-state.ts';

import nipplejs from 'nipplejs';
import { ActionManager } from './controllers/action-manager.ts';

const GRAVITY = { x: 0.0, y: -9.81, z: 0.0 };

const PaintballColors = [
  // Intentionally omitting red.
  [0, 1, 0, 1],
  [0, 0, 1, 1],
  [1, 1, 0, 1],
  [0, 1, 1, 1],
  [1, 0, 1, 1],
  [1, 0.5, 0, 1],
];

(function main() {
  WebGPUApp.Begin(class extends WebGPUApp {
    appState: AppState;

    actionManager: ActionManager;
    walkJoystick: any;
    lookJoystick: any;

    viewButton: HTMLButtonElement = document.querySelector('#view-button')!;
    emojiButton: HTMLButtonElement = document.querySelector('#emoji-button')!;
    shootButton: HTMLButtonElement = document.querySelector('#shoot-button')!;
    eraseButton: HTMLButtonElement = document.querySelector('#erase-button')!;
    clearButton: HTMLButtonElement = document.querySelector('#clear-button')!;

    emojiPicker: HTMLElement = document.querySelector('emoji-picker')!;
    decalOptionsElement: HTMLElement = document.querySelector('#decalOptions')!;
    decalRotationInput: HTMLInputElement = document.querySelector('#decalRotation')!;
    decalRotation: number = 0;
    decalFlipInput: HTMLInputElement = document.querySelector('#decalFlip')!;
    decalFlip: boolean = false;
    crosshairs: HTMLElement = document.querySelector('.crosshairs')!;

    stage: Stage = new Stage();
    camera: Actor;
    player: Actor;
    decal: Actor;
    spraycan!: Actor;
    sponge!: Actor;
    paintballGun!: Actor;
    paintballDecals: Decal[] = [];

    physics?: StagePhysics;
    controller: PhysicsFPSController;

    gltfLoader: GltfLoader;

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

    paintballClips = this.audioPlayer.loadClip('./media/sounds/paintball.mp3').subClips([
      { offset: 0.6, duration: 0.5},
      { offset: 3.4, duration: 0.5},
      { offset: 6.7, duration: 0.5},
    ]);

    /*footstepClips = this.audioPlayer.loadClip('./media/sounds/footsteps.mp3').subClips([
      { offset: 0.0, duration: 0.75},
      { offset: 0.75, duration: 0.75},
      { offset: 1.25, duration: 0.5},
      { offset: 1.75, duration: 0.5},
      { offset: 2.25, duration: 0.5},
      { offset: 2.75, duration: 0.5},
      { offset: 3.25, duration: 0.5},
      { offset: 3.75, duration: 0.5},
      { offset: 4.25, duration: 0.5},
      { offset: 4.75, duration: 0.5},
      { offset: 5.25, duration: 0.5},
    ]);*/
    playingFootstep = false;

    constructor(gpu: WebGPURenderer) {
      super(gpu);
      this.appState = new AppState(this.stage, gpu);

      if (QueryArgs.getBool('debug')) { this.stage.add(new DebugMenu(this.appState)); }

      this.gltfLoader = new GltfLoader(gpu);

      this.actionManager = new ActionManager(gpu.canvas);
      this.stage.add(this.actionManager);

      this.controller = new PhysicsFPSController();
      this.controller.speed = 0.004;
      this.controller.flying = this.appState.config.flying;

      // Has a touchscreen?
      if(this.appState.touchscreen) {
        document.querySelector('.touch-inputs')?.classList.add('touchscreen');

        this.walkJoystick = nipplejs.create({
          zone: document.querySelector('.left-input-zone')!,
          mode: 'static',
          position: { left: '30%', bottom: '30%' },
        });
        this.actionManager.setVirtualWalkJoystick(this.walkJoystick);

        this.lookJoystick = nipplejs.create({
          zone: document.querySelector('.right-input-zone')!,
          mode: 'static',
          position: { left: '70%', bottom: '30%' },
        });
        this.actionManager.setVirtualLookJoystick(this.lookJoystick);
      }

      this.player = new Actor(
        this.controller,
      );
      this.player.transform.translation = [0.2, 2, 2];
      this.stage.attachChild(this.player);

      this.camera = new Actor(
        new PerspectiveCamera({zNear: 0.01, zFar: 32}),
      );
      //this.camera.transform.translation = [0, 0, 2];
      this.player.attachChild(this.camera);

      this.decal = new Actor(
        Tag('placing-decal')
      );
      this.decal.transform.translation = [0, 0, 0];

      // Set up UI handlers
      this.#setupUIHandlers(gpu);
      this.#switchMode(InputMode.View);

      this.onEmojiPicked(this.appState.config.emoji);
    }

    async onInit(gpu: WebGPURenderer) {
      const loadingPromises: Promise<any>[] = [];

      loadingPromises.push(RAPIER.init().then(() => {
        const world = new RAPIER.World(GRAVITY);
        this.physics = new StagePhysics(world);
        this.stage.add(this.physics);
      }));

      const actorFromGltf = (url: string): Actor => {
        const actor: Actor = new Actor();
        loadingPromises.push(this.gltfLoader.loadFromUrl(url).then((scene: Actor) => {
          actor.attachChild(scene);
        }).catch((err) => {
          console.error('Gltf failed to load.', err);
        }));
        return actor;
      }

      // Load the main scene.
      this.stage.attachChild(actorFromGltf('./media/models/gallery_physics.glb'));

      // Load props
      this.spraycan = actorFromGltf('./media/models/spraypaint_can.glb');
      this.spraycan.transform.translation = [0.25, -0.75, -0.5];
      this.spraycan.transform.rotationRef.rotateY(Math.PI);

      this.sponge = actorFromGltf('./media/models/sponge.glb');
      this.sponge.transform.translation = [0.25, -0.75, -0.5];
      this.sponge.transform.rotationRef.rotateY(Math.PI * -0.33);

      this.paintballGun = actorFromGltf('./media/models/paintball_gun.glb');
      this.paintballGun.transform.translation = [0.3, -0.6, -0.5];
      this.paintballGun.transform.rotationRef.rotateY(Math.PI);

      // Load an environment map
      loadingPromises.push(gpu.textureLoader.fromUrl('./media/environment/industrial_pipe_and_valve_ibl.ktx').then((texture: GPUTexture) => {
        gpu.environmentTexture = texture;
      }));

      loadingPromises.push(this.appState.loadDecalLayoutFromUrl('./media/decalLayout.json'));

      await Promise.allSettled(loadingPromises);
    }

    #setupUIHandlers(gpu: WebGPURenderer) {
      this.decalRotationInput.addEventListener('input', (ev) => {
        // @ts-expect-error
        this.decalRotation = this.decalRotationInput.value * (Math.PI / 180);
        this.decal.transform.rotationRef.identity();
        this.decal.transform.rotationRef.rotateZ(this.decalRotation);
      });

      this.decalFlipInput.addEventListener('input', (ev) => {
        this.decalFlip = this.decalFlipInput.checked;
        this.decal.transform.scale = [this.decalFlip ? -1 : 1, 1, 1];
      });

      this.actionManager.playerActions.primary.addEventListener('start' , async () => {
        this.#onAction();
      });

      this.actionManager.playerActions.nextSlot.addEventListener('start' , async () => {
        this.#onChangeSlot(1);
      });

      this.actionManager.playerActions.prevSlot.addEventListener('start' , async () => {
        this.#onChangeSlot(-1);
      });

      if (this.appState.touchscreen) {
        const clickZone: HTMLElement = document.querySelector('.touch-click-zone')!;
        clickZone.addEventListener('pointerdown', async (ev: PointerEvent) => {
          if(this.appState.mode == InputMode.Erase) {
            await this.getSelectedDecal(gpu,
              Math.floor(ev.clientX * devicePixelRatio),
              Math.floor(ev.clientY * devicePixelRatio));
          }
          this.actionManager.playerActions.primary.pressed = true;
        });
      } else {
        // Detach from the camera on right click
        gpu.canvas.addEventListener('contextmenu', (ev) => {
          ev.preventDefault();
          this.actionManager.playerActions.primary.pressed = true;
        });
      }

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

      this.shootButton.addEventListener('click', () => {
        this.#switchMode(InputMode.Shoot);
      });

      this.eraseButton.addEventListener('click', () => {
        this.#switchMode(InputMode.Erase);
      });

      this.clearButton.addEventListener('click', () => {
        this.appState.clearDecals();
      });
    }

    #onAction() {
      if (this.appState.mode == InputMode.Paint) {
          // Lock the current decal instance in place
          const curDecal = this.decal.get(Decal);
          if (curDecal) {
            this.audioPlayer.play(this.sprayClips.random());

            this.decal.remove(Tag('placing-decal'));
            this.decal.transform = this.decal.worldTransform;
            this.stage.attachChild(this.decal);
          }

          // Create a new one decal
          this.decal = new Actor(curDecal, Tag('placing-decal'));
          this.decal.transform.rotationRef.rotateZ(this.decalRotation);
          this.decal.transform.scale = [this.decalFlip ? -1 : 1, 1, 1];

          // Quick cooldown to prevent spamming decals
          setTimeout(() => {
            if (this.appState.mode == InputMode.Paint) {
              this.camera.attachChild(this.decal);
            }
          }, this.appState.config.sprayCooldown);
        } else if (this.appState.mode == InputMode.Erase) {
          // Erase the selected decal
          this.stage.query(Decal).forEach((actor: Actor, decal: Decal) => {
            if (decal.id == this.lastSelectedDecal) {
              this.audioPlayer.play(this.eraseClips.random());

              actor.parent?.removeChild(actor);
              this.lastSelectedDecal = 0;
              this.gpu.decalManager.selectedDecal = 0;
              return false;
            }
          });
        } else if (this.appState.mode == InputMode.Shoot) {
          this.audioPlayer.play(this.paintballClips.random());

          const forward = new Vec4(0, 0, -1, 0);
          Vec4.transformMat4(forward, forward, this.camera.worldTransform.matrix);
          const ray = new RAPIER.Ray(this.camera.worldTransform.translation, forward);
          let maxToi = 32.0;
          let solid = false;

          let hit = this.physics!.world.castRay(ray, maxToi, solid, RAPIER.QueryFilterFlags.EXCLUDE_KINEMATIC);
          if (hit != null) {
              let hitPoint = ray.pointAt(hit.timeOfImpact - 0.5);

              const decal = this.paintballDecals[Math.floor(Math.random() * this.paintballDecals.length)].clone();
              decal.baseColorFactor.set(PaintballColors[Math.floor(Math.random() * PaintballColors.length)]);
              const actor = new Actor(decal);
              actor.transform = this.camera.worldTransform;
              actor.transform.translation = [hitPoint.x, hitPoint.y, hitPoint.z];
              actor.transform.rotationRef.rotateZ(Math.random() * Math.PI * 2);
              this.stage.attachChild(actor);
          }
        }

        return false;
    }

    #onChangeSlot(direction: number) {
      let newMode = this.appState.mode;
      newMode = (((newMode + direction) % 4) + 4) % 4;
      this.#switchMode(newMode);
    }

    async #switchMode(mode: InputMode) {
      this.appState.mode = mode;
      this.gpu.decalManager.selectedDecal = 0;

      // Toggle the emoji picker.
      if (this.emojiPicker.style.display === 'none' && mode == InputMode.Paint) {
        this.emojiPicker.style.display = '';
      } else {
        this.emojiPicker.style.display = 'none';
      }

      this.crosshairs.style.display = 'none';

      function setSelected(element: HTMLElement, selected: boolean) {
        if (selected) {
          element.classList.add('selected');
        } else {
          element.classList.remove('selected');
        }
      }

      setSelected(this.viewButton, this.appState.mode === InputMode.View);
      setSelected(this.emojiButton, this.appState.mode === InputMode.Paint);
      setSelected(this.shootButton, this.appState.mode === InputMode.Shoot);
      setSelected(this.eraseButton, this.appState.mode === InputMode.Erase);

      this.decalOptionsElement.style.display = this.appState.mode === InputMode.Paint ? '' : 'none';

      switch(this.appState.mode) {
        case InputMode.View:
          this.camera.removeChild(this.decal);
          this.camera.removeChild(this.spraycan);
          this.camera.removeChild(this.sponge);
          this.camera.removeChild(this.paintballGun);
          break;
        case InputMode.Paint:
          this.camera.attachChild(this.decal);
          this.camera.attachChild(this.spraycan);
          this.camera.removeChild(this.sponge);
          this.camera.removeChild(this.paintballGun);
          break;
        case InputMode.Shoot:
          this.camera.removeChild(this.decal);
          this.camera.removeChild(this.spraycan);
          this.camera.removeChild(this.sponge);
          this.camera.attachChild(this.paintballGun);

          this.crosshairs.style.display = '';
          this.crosshairs.classList.add('shoot');
          this.crosshairs.classList.remove('erase');

          for (let i = 0; i < 3; ++i) {
            this.paintballDecals[i] = await this.gpu.decalManager.getTextureDecal(`./media/textures/paintball-splat-${i}.png`);
          }

          break;
        case InputMode.Erase:
          this.camera.removeChild(this.decal);
          this.camera.removeChild(this.spraycan);
          this.camera.attachChild(this.sponge);
          this.camera.removeChild(this.paintballGun);

          this.crosshairs.style.display = '';
          this.crosshairs.classList.add('erase');
          this.crosshairs.classList.remove('shoot');

          break;
      }
    }

    async onEmojiPicked(emoji: any) {
      console.log(emoji);
      this.appState.config.emoji = emoji;
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

      if (this.appState.mode == InputMode.Erase) {
        this.getSelectedDecal(gpu,
          Math.floor(gpu.canvas.width / 2),
          Math.floor(gpu.canvas.height / 2));
      }
    }
  }, {
    canvas: document.querySelector('#webgpu-canvas') as HTMLCanvasElement
  });
})();
