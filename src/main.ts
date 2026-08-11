import { WebGPUApp, WebGPURenderer } from "./webgpu-renderer.ts";

(function main() {
  WebGPUApp.Begin(class extends WebGPUApp {
    onFrame(gpu: WebGPURenderer, timestamp: number, delta: number) {
      const colorTexture = gpu.context.getCurrentTexture();

      const commandEncoder = gpu.device.createCommandEncoder();
      const renderPass = commandEncoder.beginRenderPass({
        colorAttachments: [{
          view: colorTexture,
          loadOp: 'clear',
          clearValue: [0, Math.sin(timestamp / 1000), 1, 1],
          storeOp: 'store',
        }],
      });
      renderPass.end();
      gpu.device.queue.submit([commandEncoder.finish()]);
    }
  }, {
    canvas: document.querySelector("canvas") as HTMLCanvasElement
  });
})();
