import { WebGPURenderer, WebGPURendererOptions } from "./webgpu-renderer.ts";

/**
 * A simple resize observer implementation that returns the most pixel-accurate width and height of
 * an element available for the given browser.
 */
type ResizeCallback = (width: number, height: number, element?: Element) => void;
export class ResizeHandler {
  static #observer: ResizeObserver;
  static #elementCallbacks: WeakMap<Element, ResizeCallback>;

  static observe(element: Element, callback: ResizeCallback) {
    if (!this.#observer) {
      this.#elementCallbacks = new WeakMap();
      this.#observer = new ResizeObserver((entries) => {
        for (let entry of entries) {
          const element = entry.target;
          const callback = this.#elementCallbacks.get(element);
          if (!callback) {
            continue;
          }

          // devicePixelContentBoxSize is supported in Chrome and Firefox
          if (entry.devicePixelContentBoxSize) {
            callback(
              entry.devicePixelContentBoxSize[0].inlineSize,
              entry.devicePixelContentBoxSize[0].blockSize,
              element,
            );
          } else {
            // These values not correct but they're as close as you can get in Safari
            callback(
              entry.contentBoxSize[0].inlineSize * devicePixelRatio,
              entry.contentBoxSize[0].blockSize * devicePixelRatio,
              element,
            );
          }
        }
      });
    }

    // Ensure that the callback gets called at least once with a reasonable estimate of the pixel size.
    if (element.clientWidth != 0 && element.clientHeight != 0) {
      callback(
        Math.floor(element.clientWidth * devicePixelRatio),
        Math.floor(element.clientHeight * devicePixelRatio),
        element,
      );
    }

    this.#elementCallbacks.set(element, callback);
    this.#observer.observe(element);
  }

  static unobserve(element: Element) {
    this.#observer?.unobserve(element);
    this.#elementCallbacks?.delete(element);
  }
}

export interface WebGPUAppCallbacks {
  onInit(gpu: WebGPURenderer): void;
  onResize(gpu: WebGPURenderer, width: number, height: number): void;
  onFrame(gpu: WebGPURenderer, timestamp: number, delta: number): void;
}

export class WebGPUApp implements WebGPUAppCallbacks {
  static async Begin<AppType extends WebGPUAppCallbacks>(appType: new(gpu: WebGPURenderer) => AppType, options: WebGPURendererOptions = {}) {
    document.body.classList.add('loading');

    // Create the WebGPU device
    const adapter = await navigator.gpu?.requestAdapter();
    const device = await adapter?.requestDevice();
    if (!device) {
      console.log("Unable to create WebGPU device.");
      return;
    }

    const gpu = new WebGPURenderer(device, options);

    const app = new appType(gpu);

    await app.onInit(gpu);

    document.body.classList.remove('loading');

    // Start listening for resize events
    ResizeHandler.observe(gpu.canvas, (width, height) => {
      gpu.onResize(width, height);
      app.onResize(gpu, width, height);
    });

    // Start the render loop
    let lastFrame = performance.now();
    const rafCallback = (timestamp: number) => {
      // Always queue up another frame
      requestAnimationFrame(rafCallback);

      // Figure out the delta from the last frame.
      const delta = timestamp - lastFrame;
      lastFrame = timestamp;
      // Skip long frames because they likely mean that the user switched away from the tab for a while.
      if (delta > 1000) {
        return;
      }

      app.onFrame(gpu, timestamp, delta);
    };
    requestAnimationFrame(rafCallback);
  }

  constructor(public gpu: WebGPURenderer) {}

  async onInit(gpu: WebGPURenderer) {}

  onResize(gpu: WebGPURenderer, width: number, height: number) {
  }

  onFrame(gpu: WebGPURenderer, timestamp: number, delta: number) {}
}