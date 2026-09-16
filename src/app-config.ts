import { Config } from './util/config.ts'

export class AppConfig extends Config {
  emoji: any;
  sprayCooldown = 500;
  physicsDebugRendering = false;

  static SetDefaults(isMobile: boolean): AppConfig {
    const defaults: AppConfig = isMobile ? new MobileAppConfig() : new AppConfig();

    defaults.emoji = {
      emoji: {name: 'Firefox Logo', shortcodes: Array(1), url: './media/emoji/firefox.svg'},
      name: "Firefox Logo",
      skinTone: 0,
    }

    // Initialize any other defaults needed here based on device.

    return defaults;
  }
}

// Default settings which have been adjusted for mobile.
class MobileAppConfig extends AppConfig {
  emojiTextureSize = 128;
}