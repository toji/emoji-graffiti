import { EmojiRenderer } from './emoji-renderer.ts';

import { Stage } from './core/stage.ts';
import { Actor } from './core/actor.ts';
import { Geometry } from './geometry/geometry.ts';
import { BoxGeometry } from './geometry/descriptors/box.ts';
import { SphereGeometry } from './geometry/descriptors/sphere.ts';
import { CylinderGeometry } from './geometry/descriptors/cylinder.ts';
import { ConeGeometry } from './geometry/descriptors/cone.ts';
import { WebGPUMipmapGenerator } from './loaders/texture/mipmap-generator.ts';
import { WebGPUApp, WebGPURenderer } from './renderer/webgpu-renderer.ts';
import { UnlitMaterial } from './materials/unlit.ts';
import { AppConfig } from './app-config.ts';
import { Config } from './util/config.ts';
import { PerspectiveCamera } from './core/camera.ts';
import { OrbitController } from './controllers/orbit-controller.ts';
import { GltfLoader } from './loaders/gltf/gltf-loader.ts';
import { FlyingController } from './controllers/flying-controller.ts';
import { Decal } from './materials/decal.ts';

(function main() {
  WebGPUApp.Begin(class extends WebGPUApp {
    config: AppConfig;

    emojiButton: HTMLButtonElement;
    emojiPicker: HTMLElement;
    emojiRenderer: EmojiRenderer;

    emojiSampler: GPUSampler;
    currentEmojiTexture?: GPUTexture;
    currentEmojiBindGroup?: GPUBindGroup;

    stage: Stage = new Stage();
    box: Actor;
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

      const geometries = [
        new Geometry(gpu.device, new BoxGeometry()),
        new Geometry(gpu.device, new SphereGeometry()),
        new Geometry(gpu.device, new CylinderGeometry()),
        new Geometry(gpu.device, new ConeGeometry()),
      ];

      const materials = [
        new UnlitMaterial(gpu, { baseColorFactor: [1, 0, 0, 1] }),
        new UnlitMaterial(gpu, { baseColorFactor: [0, 1, 0, 1] }),
        new UnlitMaterial(gpu, { baseColorFactor: [0, 0, 1, 1] }),
        new UnlitMaterial(gpu, { baseColorFactor: [1, 1, 0, 1] }),
        new UnlitMaterial(gpu, { baseColorFactor: [1, 0, 1, 1] }),
        new UnlitMaterial(gpu, { baseColorFactor: [0, 1, 1, 1] }),
      ];

      this.box = new Actor(
        geometries[0],
        materials[0]
      );
      this.box.transform.translation = [4, 2, -2];
      this.stage.attachChild(this.box);

      /*for (let i = 0; i < 500; ++i) {
        const actor = new Actor(
          geometries[Math.floor(Math.random() * geometries.length)],
          materials[Math.floor(Math.random() * materials.length)]
        );

        actor.transform.translation = [
          Math.random() * 50 - 25,
          Math.random() * 50 - 25,
          Math.random() * 50 - 25
        ];
        actor.transform.scale = [Math.random() + 0.5, Math.random() + 0.5, Math.random() + 0.5];
        actor.transform.rotationRef.rotateX(Math.random() * Math.PI);
        actor.transform.rotationRef.rotateY(Math.random() * Math.PI);

        this.stage.attachChild(actor);
      }*/

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

        // Create a new decal instance
        const placedDecal = new Actor(
          this.decal.get(Decal),
        );
        placedDecal.transform = this.decal.worldTransform;
        this.stage.attachChild(placedDecal);

        return false;
      });

      this.emojiRenderer = new EmojiRenderer(gpu.textureLoader);

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
      /*this.emojiRenderer.canvas.style.position = 'absolute';
      this.emojiRenderer.canvas.style.right = '0px';
      this.emojiRenderer.canvas.style.zIndex = '1';
      document.body.insertBefore(this.emojiRenderer.canvas, gpu.canvas);*/

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

      const emojiSize = this.config.emojiTextureSize;
      const texture = this.gpu.device.createTexture({
        //label: `Emoji '${emoji.unicode}'`,
        size: [emojiSize, emojiSize, 1],
        mipLevelCount: WebGPUMipmapGenerator.calculateMipLevels(emojiSize, emojiSize),
        format: 'rgba8unorm-srgb',
        usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT
      });

      await this.emojiRenderer.renderEmoji(emoji, texture);

      if (this.currentEmojiTexture) {
        this.currentEmojiTexture.destroy();
      }

      this.currentEmojiTexture = texture;

      this.decal.get(Decal)!.texture = texture;

      const emojiMaterial = new UnlitMaterial(this.gpu, {
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
