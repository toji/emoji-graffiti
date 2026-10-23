import { Config, immutable } from '../util/config.ts'
import { QueryArgs } from '../util/query-args.ts';

export class RenderConfig extends Config {
  @immutable
  useBindless: boolean = true;

  colorFormat: GPUTextureFormat = navigator.gpu?.getPreferredCanvasFormat() ?? 'bgra8unorm';
  depthStencilFormat: GPUTextureFormat = 'depth24plus';
  selectionFormat: GPUTextureFormat = 'r32uint';
  sampleCount: number = 1;
  useDepthPrepass: boolean = true;

  // How large the render targets are compared to the screen resolution.
  // (Canvas render target size will always be 1:1 to allow for better UI)
  outputScale = 1.0;

  emojiTextureSize = 512;

  static SetDefaults(isMobile: boolean, device: GPUDevice): RenderConfig {
    const defaults: RenderConfig = isMobile ? new MobileRenderConfig() : new RenderConfig();

    // Initialize any other defaults needed here based on device.
    defaults.useBindless = QueryArgs.getBool('bindless', true) && device.features.has('chromium-experimental-sampling-resource-table');

    return defaults;
  }
}

// Default settings which have been adjusted for mobile.
class MobileRenderConfig extends RenderConfig {
  //depthStencilFormat: GPUTextureFormat = 'depth16unorm';
  sampleCount = 1;
  outputScale = 0.6;

  emojiTextureSize = 256;
}