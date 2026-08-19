import { Config } from '../common/config.ts'

export class RendererConfig extends Config {
  colorFormat: GPUTextureFormat = navigator.gpu?.getPreferredCanvasFormat() ?? 'bgra8unorm';
  depthStencilFormat: GPUTextureFormat = 'depth24plus';
  sampleCount: number = 1;

  // How large the render targets are compared to the screen resolution.
  // (Canvas render target size will always be 1:1 to allow for better UI)
  outputScale = 1.0;

  static SetDefaults(isMobile: boolean, device: GPUDevice): RendererConfig {
    const defaults: RendererConfig = isMobile ? new MobileRendererConfig() : new RendererConfig();

    // Initialize any other defaults needed here based on device.

    return defaults;
  }
}

// Default settings which have been adjusted for mobile.
class MobileRendererConfig extends RendererConfig {
  depthStencilFormat: GPUTextureFormat = 'depth16unorm';
  sampleCount = 1;
  outputScale = 0.6;
}