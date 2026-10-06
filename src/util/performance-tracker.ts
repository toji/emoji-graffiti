//import { TimestampHelper } from "./webgpu/timestamp-helper";

const DEFAULT_ENTRY_BUFFER_LENGTH = 20;

export enum SampleType {
  cpu,
  gpu,
};

export class PerformanceEntry {
  buffer: number[];
  tweakpaneBinding: any;
  tweakpaneGraph: any;
  #lastBufferIndex = 0;

  constructor(public type: SampleType, bufferLength: number = DEFAULT_ENTRY_BUFFER_LENGTH) {
    this.buffer = new Array(bufferLength);
  }

  addSample(value: number) {
    this.#lastBufferIndex = (this.#lastBufferIndex + 1 % this.buffer.length);
    this.buffer[this.#lastBufferIndex] = value;
  }

  get latest() {
    return this.buffer[this.#lastBufferIndex] ?? 0;
  }

  get min() {
    let min = Number.MAX_SAFE_INTEGER;
    for (const value of this.buffer) {
      if (value === undefined) { return 0; } // Don't have enough samples yet
      min = Math.min(value, min);
    }
    return min;
  }

  get max() {
    let max = Number.MIN_SAFE_INTEGER;
    for (const value of this.buffer) {
      if (value === undefined) { return 0; } // Don't have enough samples yet
      max = Math.max(value, max);
    }
    return max;
  }

  get average() {
    let avg = 0;
    for (const value of this.buffer) {
      if (value === undefined) { return 0; } // Don't have enough samples yet
      avg += value;
    }
    return avg / this.buffer.length;
  }
}

export class PerformanceTracker {
  entries = new Map<string, PerformanceEntry>();
  fps = new PerformanceEntry(SampleType.cpu);

  #framesRendered: number = 0;
  #lastFpsTime: number = -1;
  #frameStart: number;

  #tweakpane: any;
  //#timestampHelper: TimestampHelper;

  constructor() {
    // Give this one a longer buffer
    let frameJsTime = new PerformanceEntry(SampleType.cpu, 100);
    this.entries.set('frameJs µs', frameJsTime);
  }

  beginFrame() {
    this.#frameStart = performance.now();
    if (this.#lastFpsTime == -1) {
      this.#lastFpsTime = this.#frameStart;
    }
  }

  endFrame() {
    const endTime = performance.now();
    const frameTime = endTime - this.#frameStart;
    this.addSample('frameJs µs', frameTime * 1000, SampleType.cpu); // Put it in µs

    this.#framesRendered++;
    if (endTime - this.#lastFpsTime >= 1000) {
      this.#updateFps(endTime);
    }

    /*if (this.#timestampHelper) {
      this.#timestampHelper.read().then((values) => {
        for (const key in values) {
          this.addSample(key, values[key]);
        }
      });
    }*/
  }

  #updateFps(endTime: number) {
    this.fps.addSample(this.#framesRendered);
    if (this.#tweakpane) {
      this.#tweakpane.title = `Performance - fps: ${this.#framesRendered}`;
    }
    this.#framesRendered = 0;
    this.#lastFpsTime = endTime;
  }

  addSample(name: string, value: number, type: SampleType = SampleType.gpu): PerformanceEntry {
    let entry = this.entries.get(name);
    if (!entry) {
      entry = new PerformanceEntry(type);
      this.entries.set(name, entry);
      this.#addTweakpaneEntry(name, false);
    }
    entry.addSample(value);
    return entry;
  }

  getEntry(name: string): PerformanceEntry {
    let entry = this.entries.get(name);
    if (!entry) {
      entry = new PerformanceEntry(SampleType.gpu);
      this.entries.set(name, entry);
      this.#addTweakpaneEntry(name, false);
    }
    return entry;
  }

  clearSamples() {
    if (this.#tweakpane) {
      for (const [name, entry] of this.entries.entries()) {
        if (entry.tweakpaneBinding) {
          this.#tweakpane.remove(entry.tweakpaneBinding);
        }
        if (entry.tweakpaneGraph) {
          this.#tweakpane.remove(entry.tweakpaneGraph);
        }
      }
    }

    let frameJsTime = this.entries.get('frameJs µs');
    this.entries.clear();
    this.entries.set('frameJs µs', frameJsTime);

    if (this.#tweakpane) {
      this.#addTweakpaneEntry('frameJs µs', true);
    }
  }

  #addTweakpaneEntry(name: string, graph: boolean) {
    if (this.#tweakpane) {
      let entry = this.entries.get(name);
      if (entry.tweakpaneBinding) {
        this.#tweakpane.add(entry.tweakpaneBinding);
      } else {
        entry.tweakpaneBinding = this.#tweakpane.addBinding(entry, 'latest', { readonly: true, label: name });
      }
      if (graph) {
        if (entry.tweakpaneGraph) {
          this.#tweakpane.add(entry.tweakpaneGraph);
        } else {
          entry.tweakpaneGraph = this.#tweakpane.addBinding(entry, 'latest', {
            readonly: true, view: 'graph', label: '',
            max: 16000,
          });
        }
      }
    }
  }

  bindToTweakpane(pane: any): any {
    this.#tweakpane = pane.addFolder({
      title: `Performance - fps: ${this.fps.latest}`,
      expanded: false,
    });

    this.#addTweakpaneEntry('frameJs µs', true);

    return this.#tweakpane;
  }

  /*setTimestampHelper(timestampHelper: TimestampHelper) {
    this.#timestampHelper = timestampHelper;
  }*/
}