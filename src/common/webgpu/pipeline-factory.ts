// Copyright (c) 2024 Brandon Jones
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

/**
 * A RenderPipelineFactory is a class that creates variations of a specific
 * render pipeline. Use of a RenderPipelineFactory helps de-dup and cache
 * pipeline requests, as well as track which pipelines are used for pre-loading
 * on future runs.
 *
 * The RenderPipeline class hides the asynchronous nature of pipelines requested
 * without forceSync, and lets a pipeline requested with forceSync preempt a
 * previously requested async one.
 */

import { Config } from '../config.js';
import { GeometryLayout } from './geometry-layout.js';
import { wgsl } from './wgsl-preprocessor.js';
import { AttachmentLayout } from './attachment-layout.js';
//import { PipelinePrecacheFactory, PipelinePrecache } from './pipeline-precache.js';

type GPUPipeline = GPURenderPipeline | GPUComputePipeline;

class Pipeline<T extends GPUPipeline> {
  #requestedAt: DOMHighResTimeStamp;
  #requestCount: number = 1;
  #key: string;
  #pipeline: T;
  #promise: Promise<T>;
  #resolved = false;

  constructor(key: string, pipelinePromise: Promise<T> | T, defaultPipeline?: T) {
    this.#key = key
    this.#requestedAt = performance.now();
    if (pipelinePromise instanceof Promise) {
      if (!defaultPipeline) {
        throw new Error('Must provide a default pipeline when supplying a pipeline promise.');
      }
      this.#pipeline = defaultPipeline;
      this.#promise = pipelinePromise;
      pipelinePromise.then((pipeline) => {
        this.pipeline = pipeline;
      });
    } else {
      this.#pipeline = pipelinePromise as T;
      this.#resolved = true;
      this.#promise = Promise.resolve(this.pipeline);
    }
  }

  get promise() {
    return this.#promise;
  }

  get key() {
    return this.#key;
  }

  set pipeline(value: T) {
    if (this.#resolved) { return; } // Only allow the pipeline to be resolved once.
    this.#pipeline = value;
    this.#resolved = true;
  }

  get pipeline(): T {
    return this.#pipeline;
  }

  get resolved(): boolean {
    return this.#resolved;
  }

  get requestedAt(): DOMHighResTimeStamp {
    return this.#requestedAt;
  }

  get requestCount(): number {
    return this.#requestCount;
  }

  incrementRequestCount() {
    this.#requestCount++;
  }
}

export class RenderPipeline extends Pipeline<GPURenderPipeline> {
  use(renderPass: GPURenderPassEncoder | GPURenderBundleEncoder) {
    renderPass.setPipeline(this.pipeline);
  }
}

export class ComputePipeline extends Pipeline<GPUComputePipeline> {
  use(computePass: GPUComputePassEncoder) {
    computePass.setPipeline(this.pipeline);
  }
}

// A default pipeline is one that does no work. In the case of a render pipeline
// it will just draws degenerate triangles. Because of that it can be used with
// any bindings, and thus can serve as a placeholder for async pipelines that
// aren't yet ready.
const DEFAULT_RENDER_PIPELINES = new WeakMap<GPUDevice, Map<number, GPURenderPipeline>>();

function getDefaultRenderPipeline(device: GPUDevice, attachmentLayout: AttachmentLayout): GPURenderPipeline {
  let devicePipelines = DEFAULT_RENDER_PIPELINES.get(device);
  if (!devicePipelines) {
    devicePipelines = new Map<number, GPURenderPipeline>();
    DEFAULT_RENDER_PIPELINES.set(device, devicePipelines);
  }

  let pipeline = devicePipelines.get(attachmentLayout.id);
  if (!pipeline) {
    let outStruct = 'struct OutColors { ';
    for (let i = 0; i < attachmentLayout.colorFormats.length; ++i) {
      outStruct += `@location(${i}) color_${i}: vec4f, `;
    }
    outStruct += '}';

    const module = device.createShaderModule({
      label: 'Device Default Render',
      code: wgsl`
      @vertex fn vertexMain() -> @builtin(position) vec4f {
        return vec4f(0);
      }

      #if ${attachmentLayout.colorFormats.length > 0}
      ${outStruct}

      @fragment fn fragmentMain() -> OutColors {
        return OutColors();
      }
      #else
      @fragment fn fragmentMain() {}
      #endif
      `
    });

    let depthStencil: GPUDepthStencilState | undefined = undefined;
    if (attachmentLayout.depthStencilFormat) {
      depthStencil = {
        format: attachmentLayout.depthStencilFormat,
        depthWriteEnabled: false,
        depthCompare: 'never',
      };
    }

    pipeline = device.createRenderPipeline({
      label: 'Device Default Render',
      layout: 'auto',
      vertex: { module },
      depthStencil,
      multisample: {
        count: attachmentLayout.sampleCount,
      },
      fragment: {
        module,
        targets: attachmentLayout.colorFormats.map((format) => {
          return {
            format
          };
        })
      },
    });
    devicePipelines.set(attachmentLayout.id, pipeline);
  }

  return pipeline;
}

const DEFAULT_COMPUTE_PIPELINES = new WeakMap<GPUDevice, GPUComputePipeline>();

function getDefaultComputePipeline(device: GPUDevice): GPUComputePipeline {
  let pipeline = DEFAULT_COMPUTE_PIPELINES.get(device);
  if (!pipeline) {
    const module = device.createShaderModule({
      label: 'Device Default Compute',
      code: `@compute @workgroup_size(1) fn computeMain() {}`
    });

    pipeline = device.createComputePipeline({
      label: 'Device Default Compute',
      layout: 'auto',
      compute: { module }
    });
    DEFAULT_COMPUTE_PIPELINES.set(device, pipeline);
  }

  return pipeline;
}

// A way to keep object stringification more stable.
// From https://gist.github.com/davidfurlong/463a83a33b70a3b6618e97ec9679e490
const stableStringify = (key: string, value: any) => {
  return value instanceof Object && !(value instanceof Array) ?
    Object.keys(value).sort().reduce((sorted, key) => {
      // @ts-expect-error
      sorted[key] = value[key];
      return sorted;
    }, {}) : value;
}

export abstract class RenderPipelineFactory<T> {
  #config?: Config;
  #pipelineCache: Map<string, RenderPipeline> = new Map();

  #configCaches: Map<number, Map<string, RenderPipeline>> = new Map();
  //#precacheFactory: PipelinePrecacheFactory;

  constructor(public device: GPUDevice, config?: Config) {
    if (config) {
      this.#config = config;
      // Whenever the config changes, switch to a new or previously existing pipeline cache
      // unique to that configuration.
      this.#config.addEventListener('changed', (event) => {
        const cache = this.#configCaches.get(config.configRevision);
        if (!cache) {
          this.#pipelineCache = new Map();
          this.#configCaches.set(config.configRevision, this.#pipelineCache);
        } else {
          this.#pipelineCache = cache;
        }
      });

      this.#configCaches.set(this.#config.configRevision, this.#pipelineCache);
    }

    /*this.#precacheFactory = {
      name: this.constructor.name,
      device,
      updated: false,
      precacheFromKey: (key: string) => {
        const layoutKeys = key.split(';', 2);
        const geometryLayout = GeometryLayout.Deserialize(layoutKeys[0]);
        const attachmentLayout = AttachmentLayout.Deserialize(layoutKeys[1]);
        const argsStart = layoutKeys[0].length + layoutKeys[1].length + 2;
        const args = this.deserializeArgs(key.substring(argsStart));

        const pipeline = this.#getPipelineWithKey(geometryLayout, attachmentLayout, args, key, false);
        return pipeline.promise;
      },
      pipelineIterator: () => this.#pipelineCache.values()
    };
    PipelinePrecache.RegisterPipelineFactory(this.#precacheFactory);*/
  }

  // Returning as any to avoid type errors when accessing properties
  get config(): any { return this.#config; }

  serializeArgs(args: T): string {
    return JSON.stringify(args, stableStringify);
  }

  deserializeArgs(key: string): T {
    return JSON.parse(key);
  }

  getPipeline(geometryLayout: GeometryLayout, attachmentLayout: AttachmentLayout, args: T, forceSync: boolean = false): RenderPipeline {
    const key = `${geometryLayout.serializeToString()};${attachmentLayout.serializeToString()};${JSON.stringify(args, stableStringify)}`;
    return this.#getPipelineWithKey(geometryLayout, attachmentLayout, args, key, forceSync);
  }

  #getPipelineWithKey(geometryLayout: GeometryLayout, attachmentLayout: AttachmentLayout, args: T, key: string, forceSync: boolean = false): RenderPipeline {
    let pipeline = this.#pipelineCache.get(key);

    if (pipeline && (pipeline.resolved || !forceSync)) {
      pipeline.incrementRequestCount();
      return pipeline;
    }

    const descriptor = this.getPipelineDescriptor(geometryLayout, attachmentLayout, args);
    if (pipeline) {
      pipeline.pipeline = this.device.createRenderPipeline(descriptor);
    } else if (!pipeline) {
      if (forceSync) {
        pipeline = new RenderPipeline(key,
          this.device.createRenderPipeline(descriptor));
      } else {
        pipeline = new RenderPipeline(key,
          this.device.createRenderPipelineAsync(descriptor),
          getDefaultRenderPipeline(this.device, attachmentLayout));
      }
      this.#pipelineCache.set(key, pipeline);
    }
    //this.#precacheFactory.updated = true;
    return pipeline;
  }

  abstract getPipelineDescriptor(geometryLayout: GeometryLayout, attachmentLayout: AttachmentLayout, args: T): GPURenderPipelineDescriptor;
}

export abstract class ComputePipelineFactory<T> {
  #config?: Config;
  #pipelineCache: Map<string, ComputePipeline> = new Map();

  #configCaches: Map<number, Map<string, ComputePipeline>> = new Map();
  //#precacheFactory: PipelinePrecacheFactory;

  constructor(public device: GPUDevice, config?: Config) {
    if (config) {
      this.#config = config;
      // Whenever the config changes, switch to a new or previously existing pipeline cache
      // unique to that configuration.
      this.#config.addEventListener('changed', (event) => {
        const cache = this.#configCaches.get(config.configRevision);
        if (!cache) {
          this.#pipelineCache = new Map();
          this.#configCaches.set(config.configRevision, this.#pipelineCache);
        } else {
          this.#pipelineCache = cache;
        }
      });

      this.#configCaches.set(this.#config.configRevision, this.#pipelineCache);
    }

    /*this.#precacheFactory = {
      name: this.constructor.name,
      device,
      updated: false,
      precacheFromKey: (key: string) => {
        const args = this.deserializeArgs(key);
        const pipeline = this.#getPipelineWithKey(args, key, false);
        return pipeline.promise;
      },
      pipelineIterator: () => this.#pipelineCache.values()
    };
    PipelinePrecache.RegisterPipelineFactory(this.#precacheFactory);*/
  }

  // Returning as any to avoid type errors when accessing properties
  get config(): any { return this.#config; }

  serializeArgs(args: T): string {
    return JSON.stringify(args, stableStringify);
  }

  deserializeArgs(key: string): T {
    return JSON.parse(key);
  }

  getPipeline(args: T, forceSync: boolean = false): ComputePipeline {
    const key = this.serializeArgs(args);
    return this.#getPipelineWithKey(args, key, forceSync);
  }

  #getPipelineWithKey(args: T, key: string, forceSync: boolean = false): ComputePipeline {
    let pipeline = this.#pipelineCache.get(key);

    if (pipeline && (pipeline.resolved || !forceSync)) {
      pipeline.incrementRequestCount();
      return pipeline;
    }

    const descriptor = this.getPipelineDescriptor(args);
    if (pipeline) {
      pipeline.pipeline = this.device.createComputePipeline(descriptor);
    } else if (!pipeline) {
      if (forceSync) {
        pipeline = new ComputePipeline(key,
          this.device.createComputePipeline(descriptor));
      } else {
        pipeline = new ComputePipeline(key,
          this.device.createComputePipelineAsync(descriptor),
          getDefaultComputePipeline(this.device));
      }
      this.#pipelineCache.set(key, pipeline);
    }
    //this.#precacheFactory.updated = true;
    return pipeline;
  }

  abstract getPipelineDescriptor(args: T): GPUComputePipelineDescriptor;
}
