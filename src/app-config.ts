import { DecalEmoji } from './materials/decal.ts';
import { Config } from './util/config.ts'

export class AppConfig extends Config {
  emoji: DecalEmoji = {unicode: '😀'};
  sprayCooldown = 500;
  physicsDebugRendering = false;
  flying = false;
  noclip = false;
}