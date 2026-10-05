import { Vec4 } from "gl-matrix";
import { AppConfig } from "./app-config.ts";
import { Actor, Tag } from "./core/actor.ts";
import { Stage } from "./core/stage.ts";
import { Decal } from "./materials/decal.ts";
import { WebGPURenderer } from "./renderer/webgpu-renderer.ts";
import { Config } from "./util/config.ts";
import { QueryArgs } from "./util/query-args.ts";

export enum InputMode {
  View,
  Paint,
  Shoot,
  Erase,
};

export class AppState {
  stage: Stage;
  config: AppConfig;
  gpu: WebGPURenderer;
  mode: InputMode = InputMode.View;
  touchscreen: boolean;
  debug: boolean;

  constructor(stage: Stage, gpu: WebGPURenderer) {
    this.stage = stage;
    this.gpu = gpu;
    this.config = Config.Create(AppConfig);

    this.touchscreen = window.matchMedia("(pointer: coarse)").matches || QueryArgs.getBool('forceTouch', false);
    this.debug = QueryArgs.getBool('debug');

    this.stage.add(this);
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
      let decalComponent = await this.gpu.decalManager.getDecal(emoji);
      if (decal.baseColorFactor) {
        decalComponent = decalComponent.clone();
        decalComponent.baseColorFactor.copy(decal.baseColorFactor);
      }
      const actor = new Actor(decalComponent);
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
        decalLayout.emoji[decal.textureIndex] = {
          unicode: decal.emoji.unicode,
          url: decal.emoji.url
        };
      }

      const out: any = {
        emojiIndex: decal.textureIndex,
        translation: [...actor.worldTransform.translation],
        rotation: [...actor.worldTransform.rotation],
      };

      if (!Vec4.equals(decal.baseColorFactor, [1, 1, 1, 1])) {
        out.baseColorFactor = [...decal.baseColorFactor];
      }

      decalLayout.decals.push(out);
    });

    return JSON.stringify(decalLayout);
  }
}