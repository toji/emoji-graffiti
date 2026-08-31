import { Config } from '../util/config.ts'

export class RenderConfig extends Config {
  colorFormat: GPUTextureFormat = navigator.gpu?.getPreferredCanvasFormat() ?? 'bgra8unorm';
  depthStencilFormat: GPUTextureFormat = 'depth24plus';
  sampleCount: number = 1;

  // How large the render targets are compared to the screen resolution.
  // (Canvas render target size will always be 1:1 to allow for better UI)
  outputScale = 1.0;

  emojiTextureSize = 256;

  static SetDefaults(isMobile: boolean, device: GPUDevice): RenderConfig {
    const defaults: RenderConfig = isMobile ? new MobileRenderConfig() : new RenderConfig();

    // Initialize any other defaults needed here based on device.

    return defaults;
  }
}

// Default settings which have been adjusted for mobile.
class MobileRenderConfig extends RenderConfig {
  depthStencilFormat: GPUTextureFormat = 'depth16unorm';
  sampleCount = 1;
  outputScale = 0.6;

  emojiTextureSize = 128;
}