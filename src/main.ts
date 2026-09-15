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
import RAPIER from '@dimforge/rapier3d-compat';
import { StagePhysics } from './physics/stage-physics.ts';
import { RigidBody } from './physics/rigid-body.ts';
import { StaticCollider } from './physics/static-collider.ts';
import { Geometry } from './geometry/geometry.ts';
import { BoxGeometry } from './geometry/descriptors/box.ts';
import { PBRMaterial } from './materials/pbr.ts';
import { Vec3, Vec4 } from 'gl-matrix';
import { PhysicsDebugRenderer } from './physics/physics-debug-renderer.ts';

enum InputMode {
  View,
  Paint,
  Erase,
  Shoot,
};

const GRAVITY = { x: 0.0, y: -9.81, z: 0.0 };

(function main() {
  WebGPUApp.Begin(class extends WebGPUApp {
    config: AppConfig;

    pane: Pane;

    viewButton: HTMLButtonElement = document.querySelector('#view-button')!;
    emojiButton: HTMLButtonElement = document.querySelector('#emoji-button')!;
    shootButton: HTMLButtonElement = document.querySelector('#shoot-button')!;
    eraseButton: HTMLButtonElement = document.querySelector('#erase-button')!;
    clearButton: HTMLButtonElement = document.querySelector('#clear-button')!;

    emojiPicker: HTMLElement = document.querySelector('emoji-picker')!;
    decalRotationInput: HTMLInputElement = document.querySelector('#decalRotation')!;
    decalRotation: number = 0;

    stage: Stage = new Stage();
    camera: Actor;
    decal: Actor;
    spraycan: Actor;
    sponge: Actor;
    paintballGun: Actor;
    paintballDecals: Decal[] = [];

    physics?: StagePhysics;

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

    paintballClips = this.audioPlayer.loadClip('./media/sounds/paintball.mp3').subClips([
      { offset: 0.6, duration: 0.5},
      { offset: 3.4, duration: 0.5},
      { offset: 6.7, duration: 0.5},
    ]);

    constructor(gpu: WebGPURenderer) {
      super(gpu);
      this.config = Config.Create(AppConfig);

      RAPIER.init().then(() => {
        const world = new RAPIER.World(GRAVITY);

        this.physics = new StagePhysics(world);
        this.stage.add(this.physics);
        //this.stage.add(new PhysicsDebugRenderer(gpu));

        const cube = new Actor(
          new RigidBody(
            RAPIER.RigidBodyDesc.dynamic(),
            [RAPIER.ColliderDesc.cuboid(0.5, 0.5, 0.5)]
          ),
          new Geometry(gpu.device, new BoxGeometry()),
          new PBRMaterial(gpu, { baseColorFactor: [0.2, 0.4, 0.9, 1.0], roughnessFactor: 0.3, metallicFactor: 0.8 })
        );
        cube.transform.translation = [0, 8, 0];
        cube.transform.rotationRef.rotateX(0.2);
        cube.transform.rotationRef.rotateZ(0.2);
        this.stage.attachChild(cube);
      });

      this.pane = new Pane({
        title: document.title.split('-')[0],
      });

      this.pane.addButton({
        title: 'Save',
      }).on('click', () => {
        const json = this.serializeDecalLayout();
        console.log('Serialized Decals: ', json);
        //this.deserializeDecalLayout(json);

        const blob = new Blob([json], { type: "text/json" });
        const link = document.createElement("a");
        link.download = 'decalLayout.json';
        link.href = window.URL.createObjectURL(blob);
        link.dataset.downloadurl = ["text/json", link.download, link.href].join(":");
        /*const evt = new MouseEvent("click", {
            view: window,
            bubbles: true,
            cancelable: true,
        });*/
        link.click(); //dispatchEvent(evt);
        link.remove();
      });

      this.pane.addButton({
        title: 'Load',
      }).on('click', () => {
        let input = document.createElement('input');
        input.type = 'file';
        input.onchange = async () => {
          // you can use this method to get file and perform respective operations
          let file = input.files?.item(0);
          if (file) {
            this.deserializeDecalLayout(await file.text());
          }
        };
        input.click();
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
      gpu.textureLoader.fromUrl('./media/environment/industrial_pipe_and_valve_ibl.ktx').then((texture: GPUTexture) => {
        gpu.environmentTexture = texture;
      });

      this.loadDecalLayoutFromUrl('./media/decalLayout.json');

      const controller = new FlyingController(gpu.canvas);
      controller.speed = 0.004;
      this.camera = new Actor(
        new PerspectiveCamera({zNear: 0.01, zFar: 32}),
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
        } else if (this.mode == InputMode.Shoot) {
          this.audioPlayer.play(this.paintballClips[Math.floor(Math.random() * this.paintballClips.length)]);

          const forward = new Vec4(0, 0, -1, 0);
          Vec4.transformMat4(forward, forward, this.camera.worldTransform.matrix);
          const ray = new RAPIER.Ray(this.camera.worldTransform.translation, forward);
          let maxToi = 32.0;
          let solid = false;

          let hit = this.physics!.world.castRay(ray, maxToi, solid);
          if (hit != null) {
              // The first collider hit has the handle `hit.colliderHandle` and it hit after
              // the ray travelled a distance equal to `ray.dir * toi`.
              let hitPoint = ray.pointAt(hit.timeOfImpact - 0.5); // Same as: `ray.origin + ray.dir * toi`

              const paintDecal = new Actor(this.paintballDecals[Math.floor(Math.random() * this.paintballDecals.length)]);
              paintDecal.transform = this.camera.transform;
              paintDecal.transform.translation = [hitPoint.x, hitPoint.y, hitPoint.z];
              paintDecal.transform.rotationRef.rotateZ(Math.random() * Math.PI * 2);
              this.stage.attachChild(paintDecal);
          }

          // TODO: Remove this later.
          /*const rigidBody = new RigidBody(
            RAPIER.RigidBodyDesc.dynamic(),
            [RAPIER.ColliderDesc.cuboid(0.1, 0.1, 0.1)]
          );

          const cube = new Actor(
            rigidBody,
            new Geometry(gpu.device, new BoxGeometry({ width: 0.2, height: 0.2, depth: 0.2 })),
            new PBRMaterial(gpu, { baseColorFactor: [0.9, 0.4, 0.2, 1.0], roughnessFactor: 0.1, metallicFactor: 0.8 })
          );
          cube.transform = this.camera.transform;
          this.stage.attachChild(cube);

          const forward = new Vec4(0, 0, -0.2, 0);
          Vec4.transformMat4(forward, forward, this.camera.transform.matrix);
          rigidBody.rigidBody?.applyImpulse(forward, true);
          rigidBody.rigidBody?.applyTorqueImpulse({
            x: (Math.random() - 0.5) * 0.001,
            y: (Math.random() - 0.5) * 0.001,
            z: (Math.random() - 0.5) * 0.001,
          }, true);*/
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

      this.shootButton.addEventListener('click', () => {
        this.#switchMode(InputMode.Shoot);
      });

      this.eraseButton.addEventListener('click', () => {
        this.#switchMode(InputMode.Erase);
      });

      this.clearButton.addEventListener('click', () => {
        this.clearDecals();
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

    async #switchMode(mode: InputMode) {
      this.mode = mode;
      this.gpu.decalManager.selectedDecal = 0;

      // Toggle the emoji picker.
      if (this.emojiPicker.style.display === 'none' && mode == InputMode.Paint) {
        this.emojiPicker.style.display = '';
      } else {
        this.emojiPicker.style.display = 'none';
      }

      switch(this.mode) {
        case InputMode.View:
          this.viewButton.classList.add('selected');
          this.emojiButton.classList.remove('selected');
          this.shootButton.classList.remove('selected');
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
          this.shootButton.classList.remove('selected');
          this.eraseButton.classList.remove('selected');
          this.camera.attachChild(this.decal);
          this.camera.attachChild(this.spraycan);
          this.camera.removeChild(this.sponge);
          this.camera.removeChild(this.paintballGun);
          break;
        case InputMode.Shoot:
          this.viewButton.classList.remove('selected');
          this.emojiButton.classList.remove('selected');
          this.shootButton.classList.add('selected');
          this.eraseButton.classList.remove('selected');
          this.camera.removeChild(this.decal);
          this.camera.removeChild(this.spraycan);
          this.camera.removeChild(this.sponge);
          this.camera.attachChild(this.paintballGun);

          for (let i = 0; i < 3; ++i) {
            this.paintballDecals[i] = await this.gpu.decalManager.getTextureDecal(`./media/textures/paintball-splat-${i}.png`);
            this.paintballDecals[i].projection.perspectiveZO(Math.PI/8, 1, 0.1, 2);
          }

          break;
        case InputMode.Erase:
          this.viewButton.classList.remove('selected');
          this.emojiButton.classList.remove('selected');
          this.shootButton.classList.remove('selected');
          this.eraseButton.classList.add('selected');
          this.camera.removeChild(this.decal);
          this.camera.removeChild(this.spraycan);
          this.camera.attachChild(this.sponge);
          this.camera.removeChild(this.paintballGun);
          this.emojiPicker.style.display = 'none';
          break;
      }
    }

    clearDecals() {
      this.stage.query(Decal).forEach((actor: Actor) => {
        // Don't remove the decal that we're using to place the next one.
        if (!actor.has(Tag('placing-decal'))) {
          actor.parent?.removeChild(actor);
        }
      });
    }

    async loadDecalLayoutFromUrl(url: string) {
      const response = await fetch(url);
      this.deserializeDecalLayoutFromJson(await response.json());
    }

    deserializeDecalLayoutFromString(json: string) {
      const decalLayout = JSON.parse(json);
      this.deserializeDecalLayoutFromJson(decalLayout);
    }

    async deserializeDecalLayoutFromJson(decalLayout: any) {
      this.clearDecals();

      if (decalLayout.version != 1) {
        throw new Error(`Unsupported DecalLayout version: ${decalLayout.version}`);
      }

      for (const decal of decalLayout.decals) {
        const emoji = decalLayout.emoji[decal.emojiIndex];
        const actor = new Actor(await this.gpu.decalManager.getDecal(emoji));
        actor.transform.translation = decal.translation;
        actor.transform.rotation = decal.rotation;
        this.stage.attachChild(actor);
      }
    }

    serializeDecalLayout(): string {
      const decalLayout: any = {
        version: 1,
        emoji: [],
        decals: [],
      };

      this.stage.query(Decal).forEach((actor: Actor, decal: Decal) => {
        // Don't serialize the placing helper.
        if (actor.has(Tag('placing-decal'))) {
          return;
        }

        if (!decalLayout.emoji[decal.textureIndex]) {
          decalLayout.emoji[decal.textureIndex] = decal.emoji;
        }

        decalLayout.decals.push({
          emojiIndex: decal.textureIndex,
          translation: [...actor.worldTransform.translation],
          rotation: [...actor.worldTransform.rotation],
        });
      });

      return JSON.stringify(decalLayout);
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
