import { Config } from './util/config.ts'

export class AppConfig extends Config {
  emojiTextureSize = 256;

  static SetDefaults(isMobile: boolean): AppConfig {
    const defaults: AppConfig = isMobile ? new MobileAppConfig() : new AppConfig();

    // Initialize any other defaults needed here based on device.

    return defaults;
  }
}

// Default settings which have been adjusted for mobile.
class MobileAppConfig extends AppConfig {
  emojiTextureSize = 128;
}