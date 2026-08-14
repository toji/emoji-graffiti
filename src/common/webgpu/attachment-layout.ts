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
 * An AttachmentLayout is a description of the render attachments used by a
 * render pass. Can be passed as a GPURenderPassLayout if needed.
 *
 * The AttachmentLayout has an internal cache which uses the serialized form of the AttachmentLayout
 * to dedup them and assign a unique ID to each, which is then even easier to use for cache lookups
 * (though only for the given session.)
 */

import { BufferToHexString, HexStringToBuffer } from '../buffer-to-hex.ts';

// Do not place numeric values in these enums with another format.
// Can go up to 256 before the serialized format needs to change
enum RenderableFormatValue {
  'r8unorm' = 1,
  'r8uint' = 2,
  'r8sint' = 3,
  'rg8unorm' = 4,
  'rg8uint' = 5,
  'rg8sint' = 6,
  'rgba8unorm' = 7,
  'rgba8unorm-srgb' = 8,
  'rgba8uint' = 9,
  'rgba8sint' = 10,
  'bgra8unorm' = 11,
  'bgra8unorm-srgb' = 12,
  'r16uint' = 13,
  'r16sint' = 14,
  'r16float' = 15,
  'rg16uint' = 16,
  'rg16sint' = 17,
  'rg16float' = 18,
  'rgba16uint' = 19,
  'rgba16sint' = 20,
  'rgba16float' = 21,
  'r32uint' = 22,
  'r32sint' = 23,
  'r32float' = 24,
  'rg32uint' = 25,
  'rg32sint' = 26,
  'rg32float' = 27,
  'rgba32uint' = 28,
  'rgba32sint' = 29,
  'rgba32float' = 30,
  'rgb10a2uint' = 31,
  'rgb10a2unorm' = 32,
  'rg11b10ufloat' = 33,
}

enum DepthStencilFormatValue {
  'stencil8' = 1,
  'depth16unorm' = 2,
  'depth24plus' = 3,
  'depth24plus-stencil8' = 4,
  'depth32float' = 5,
  'depth32float-stencil8' = 6,
}

type RenderableFormat = keyof typeof RenderableFormatValue;
type DepthStencilFormat = keyof typeof DepthStencilFormatValue;

export class AttachmentLayout {
  // Caching
  static #nextId = 1;
  static #keyMap = new Map<string, number>(); // Map of the given key to an ID
  static #cache = new Map<number, AttachmentLayout>(); // Map of ID to cached resource

  static GetById(id: number): AttachmentLayout | undefined {
    return this.#cache.get(id);
  }

  static #AddToCache(layout: AttachmentLayout, key: string): AttachmentLayout {
    Object.freeze(layout);

    this.#keyMap.set(key, layout.id);
    this.#cache.set(layout.id, layout);

    return layout;
  }

  static Deserialize(value: string): AttachmentLayout {
    const id = this.#keyMap.get(value);
    if (id !== undefined) {
      return this.#cache.get(id)!;
    }

    const buffer = HexStringToBuffer(value);
    const layout = AttachmentLayout.#DeserializeFromBuffer(buffer);
    layout.#serializedBuffer = buffer;
    layout.#serializedString = value;
    return this.#AddToCache(layout, value);
  }

  static #DeserializeFromBuffer(inBuffer: ArrayBuffer, bufferOffest?: number, bufferLength?: number): AttachmentLayout {
    const dataView = new DataView(inBuffer, bufferOffest, bufferLength);

    const sampleCount = dataView.getUint8(0);
    const depthStencilFormat = DepthStencilFormatValue[dataView.getUint8(1)] as DepthStencilFormat;
    const colorFormatCount = dataView.getUint8(2);

    const colorFormats: RenderableFormat[] = [];
    for (let i = 0; i < colorFormatCount; ++i) {
      // @ts-expect-error
      colorFormats.push(RenderableFormatValue[dataView.getUint8(3+i)]);
    }

    return new AttachmentLayout(colorFormats, depthStencilFormat, sampleCount);
  }

  // Layout
  id: number;

  colorFormats: RenderableFormat[];
  depthStencilFormat?: DepthStencilFormat;
  sampleCount: number;

  #serializedBuffer?: ArrayBuffer;
  #serializedString?: string;

  private constructor(colorFormats: GPUTextureFormat | GPUTextureFormat[], depthStencilFormat?: GPUTextureFormat, sampleCount: number = 1) {
    // Copy the colorFormats, because the AttachmentLayout will take ownership of them.
    const formats: RenderableFormat[] = [];

    if (Array.isArray(colorFormats)) {
      for (const format of colorFormats) {
        // @ts-expect-error
        if (RenderableFormatValue[format] == undefined) {
          throw new Error(`${format} is not a renderable format`);
        }
        formats.push(format as RenderableFormat);
      }
    } else {
      // @ts-expect-error
      if (RenderableFormatValue[colorFormats] == undefined) {
        throw new Error(`${colorFormats} is not a renderable format`);
      }
      formats.push(colorFormats as RenderableFormat);
    }

    // @ts-expect-error
    if (depthStencilFormat && DepthStencilFormatValue[depthStencilFormat] == undefined) {
      throw new Error(`${depthStencilFormat} is not a depth/stencil format`);
    }

    this.id = 0;
    this.colorFormats = formats;
    this.depthStencilFormat = depthStencilFormat as DepthStencilFormat;
    this.sampleCount = sampleCount;

    const key = this.serializeToString();
    const id = AttachmentLayout.#keyMap.get(key);
    if (id !== undefined) {
      return AttachmentLayout.#cache.get(id)!;
    }

    this.id = AttachmentLayout.#nextId++;

    AttachmentLayout.#AddToCache(this, key);
  }

  // The AttachmentLayout's binary serialized format is:
  //  - Byte 0: Sample Count
  //  - Byte 1: DepthStencilFormat
  //  - Byte 3: Color Format Count (N)
  //  - Byte 4-N: RenderableFormat
  serializeToBuffer(): ArrayBuffer {
    if (this.#serializedBuffer) {
      return this.#serializedBuffer;
    }

    const byteLength = 3 + this.colorFormats.length;
    const outBuffer = new ArrayBuffer(byteLength);
    const dataView = new DataView(outBuffer);

    dataView.setUint8(0, this.sampleCount);
    dataView.setUint8(1, this.depthStencilFormat ? DepthStencilFormatValue[this.depthStencilFormat] : 0);
    dataView.setUint8(2, this.colorFormats.length);

    for (let i = 0; i < this.colorFormats.length; ++i) {
      dataView.setUint8(i + 3, RenderableFormatValue[this.colorFormats[i]]);
    }

    this.#serializedBuffer = outBuffer;
    return outBuffer;
  }

  // The string format is the same as the binary format, written in hex pairs.
  serializeToString() {
    if (!this.#serializedString) {
      this.#serializedString = BufferToHexString(this.serializeToBuffer());
    }
    return this.#serializedString;
  }
}