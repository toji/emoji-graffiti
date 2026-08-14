// Copyright (c) 2023 Brandon Jones
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
 * A GeometryLayout describes the buffer layout, topology, and stripIndexFormat of a piece of
 * geometry, which makes up a good percentage of the information needed when building a render
 * pipeline. It can be serialized and deserialized to and from a very compact string form, which
 * can then be used as a key for cache lookups or transmitting over a wire.
 *
 * The GeometryLayout has an internal cache which uses the serialized form of the GeometryLayout to
 * dedup them and assign a unique ID to each, which is then even easier to use for cache lookups
 * (though only for the given session.)
 *
 * While the geometry layout internally is stated in terms of WebGPU interfaces, the information it
 * contains is equally applicable to WebGL as long as you're willing to adhere to WebGPU-supported
 * formats.
 */

import { BufferToHexString, HexStringToBuffer } from "../buffer-to-hex.ts";

enum TopologyId {
  'point-list',
  'line-list',
  'line-strip',
  'triangle-strip',
  'triangle-list',
};

const TopologyMask = TopologyId["point-list"] |
                     TopologyId["line-list"] |
                     TopologyId["line-strip"] |
                     TopologyId["triangle-strip"] |
                     TopologyId["triangle-list"];

enum StripIndexFormatId {
  uint16 = 0x00,
  uint32 = 0x10,
};

enum FormatId {
  uint8x2,
  uint8x4,
  sint8x2,
  sint8x4,
  unorm8x2,
  unorm8x4,
  snorm8x2,
  snorm8x4,
  uint16x2,
  uint16x4,
  sint16x2,
  sint16x4,
  unorm16x2,
  unorm16x4,
  snorm16x2,
  snorm16x4,
  float16x2,
  float16x4,
  float32,
  float32x2,
  float32x3,
  float32x4,
  uint32,
  uint32x2,
  uint32x3,
  uint32x4,
  sint32,
  sint32x2,
  sint32x3,
  sint32x4,
};

enum StepModeId {
  vertex   = 0x0000,
  instance = 0x8000,
};

interface GeometryAttributeInfo {
  bufferIndex: number;
  stride: number,
  offset: number,
  format: GPUVertexFormat,
}

export class GeometryLayout {
  // Caching
  static #nextId = 1;
  static #keyMap = new Map<string, number>(); // Map of the given key to an ID
  static #cache = new Map<number, GeometryLayout>(); // Map of ID to cached resource

  static GetById(id: number): GeometryLayout | undefined {
    return this.#cache.get(id);
  }

  static #AddToCache(layout: GeometryLayout, key: string): GeometryLayout {
    layout.id = this.#nextId++;
    Object.freeze(layout);

    this.#keyMap.set(key, layout.id);
    this.#cache.set(layout.id, layout);

    return layout;
  }

  static Deserialize(value: string): GeometryLayout {
    const id = this.#keyMap.get(value);

    if (id !== undefined) {
      return this.#cache.get(id)!;
    }

    const buffer = HexStringToBuffer(value);
    const layout = GeometryLayout.#DeserializeFromBuffer(buffer);
    layout.#serializedBuffer = buffer;
    layout.#serializedString = value;
    return this.#AddToCache(layout, value);
  }

  static #DeserializeFromBuffer(inBuffer: ArrayBuffer, bufferOffest?: number, bufferLength?: number) {
    const dataView = new DataView(inBuffer, bufferOffest, bufferLength);

    const topologyData8 = dataView.getUint8(0);
    const topology = TopologyId[topologyData8 & TopologyMask] as GPUPrimitiveTopology;

    let stripIndexFormat = 'uint32' as GPUIndexFormat;
    switch(topology) {
      case 'triangle-strip':
      case 'line-strip':
        stripIndexFormat = StripIndexFormatId[topologyData8 & 0xF0] as GPUIndexFormat;
    }

    const buffers = [];
    let offset = 1;
    while (offset < dataView.byteLength) {
      const bufferData16 = dataView.getUint16(offset, true);
      const attribCount = bufferData16 & 0x0F;
      let buffer = {
        attributes: new Array(attribCount),
        arrayStride: (bufferData16 >> 4) & 0x08FF,
        stepMode: StepModeId[bufferData16 & 0x8000] as GPUVertexStepMode,
      };
      buffers.push(buffer);
      offset += 2;

      for (let i = 0; i < attribCount; ++i) {
        const attribData16 = dataView.getUint16(offset, true);
        buffer.attributes[i] = {
          offset: attribData16 & 0x0FFF,
          shaderLocation: (attribData16 >> 12) & 0x0F,
          format: FormatId[dataView.getUint8(offset+2)]
        };
        offset += 3;
      }
    }

    return new GeometryLayout(buffers, topology, stripIndexFormat);
  }

  // Layout
  id: number;

  buffers: GPUVertexBufferLayout[];
  topology: GPUPrimitiveTopology;
  stripIndexFormat?: GPUIndexFormat;

  #serializedBuffer?: ArrayBuffer;
  #serializedString?: string;
  #locationsUsed?: Set<number>;
  #locationsInfo?: Map<number, GeometryAttributeInfo>;

  private constructor(attribBuffers: GPUVertexBufferLayout[],
      topology: GPUPrimitiveTopology = 'triangle-list',
      indexFormat: GPUIndexFormat = 'uint32') {
    this.id = 0;
    // Copy the attribBuffers, because the GeometryLayout will take ownership of them.
    this.buffers = structuredClone(attribBuffers);
    this.topology = topology;
    if (topology == 'triangle-strip' || topology == 'line-strip') {
      this.stripIndexFormat = indexFormat;
    }

    const key = this.serializeToString();
    const id = GeometryLayout.#keyMap.get(key);
    if (id !== undefined) {
      return GeometryLayout.#cache.get(id)!;
    }

    this.id = GeometryLayout.#nextId++;

    GeometryLayout.#AddToCache(this, key);
  }

  get locationsUsed(): Set<number> {
    if (!this.#locationsUsed) {
      this.#locationsUsed = new Set<number>();
      for (const buffer of this.buffers) {
        for (const attrib of buffer.attributes) {
          this.#locationsUsed.add(attrib.shaderLocation);
        }
      }
    }

    return this.#locationsUsed;
  }

  getLocationInfo(shaderLocation: number): GeometryAttributeInfo | undefined {
    if (!this.#locationsInfo) {
      this.#locationsInfo = new Map<number, GeometryAttributeInfo>();
      for (let i = 0; i < this.buffers.length; ++i) {
        const buffer = this.buffers[i];
        for (const attrib of buffer.attributes) {
          this.#locationsInfo.set(attrib.shaderLocation, {
            bufferIndex: i,
            stride: buffer.arrayStride,
            offset: attrib.offset,
            format: attrib.format,
          });
        }
      }
    }
    return this.#locationsInfo.get(shaderLocation);
  }

  getLocationBaseType(shaderLocation: number): string | undefined {
    const format = this.getLocationInfo(shaderLocation)?.format;
    if (!format) { return undefined; }

    if (format.startsWith('float') || format.startsWith('unorm') || format.startsWith('snorm')) {
      return 'f32';
    } else if (format.startsWith('uint')) {
      return 'u32';
    } else if (format.startsWith('sint')) {
      return 'i32';
    }
    // Should not get here.
    console.error(`Shader Location ${shaderLocation} has format "${format}" with an unknown base type.`);
    return undefined;
  }

  // The GeometryLayout's binary serialized format is:
  //  - Byte 0, low 4 bits: Topology
  //  - Byte 0, high 4 bits: Index format (0 = 16 bit, 1 = 32 bit)
  // Then repeat till data's end:
  //  - First 16 bit value:
  //    - Lowest 4 bits: Number of attributes for buffer
  //    - Middle 11 bits: Array stride
  //    - High bit: Step mode (0 = vertex, 1 = instance)
  //  - Per attribute for this buffer:
  //    - First 16 bit value:
  //      - Lowest 12 bits: Attribute offset
  //      - Highest 4 bits: Shader location
  //    - Next 8 bit value: Attribute Format
  serializeToBuffer(): ArrayBuffer {
    if (this.#serializedBuffer) {
      return this.#serializedBuffer;
    }

    let attribCount = 0;
    for (const buffer of this.buffers) {
      attribCount += (buffer.attributes as []).length;
    }

    // Each buffer takes 2 bytes to encode and each attribute takes 3 bytes.
    // The primitive topology takes 1 byte.
    const byteLength = 1 + (this.buffers.length * 2) + attribCount * 3;
    const outBuffer = new ArrayBuffer(byteLength);
    const dataView = new DataView(outBuffer);

    let topologyData8 = TopologyId[this.topology];
    if (this.stripIndexFormat !== undefined) {
      topologyData8 += StripIndexFormatId[this.stripIndexFormat];
    }
    dataView.setUint8(0, topologyData8);

    let offset = 1;
    for (const buffer of this.buffers) {
      let bufferData16 = (buffer.attributes as []).length; // Lowest 4 bits
      bufferData16 += buffer.arrayStride << 4;          // Middle 11 bits
      bufferData16 += StepModeId[buffer.stepMode || 'vertex']; // Highest bit
      dataView.setUint16(offset, bufferData16, true);
      offset += 2;

      for (const attrib of buffer.attributes) {
        let attribData16 = attrib.offset || 0; // Lowest 12 bits
        attribData16 += attrib.shaderLocation << 12; // Highest 4 bits
        dataView.setUint16(offset, attribData16, true);
        // @ts-expect-error
        dataView.setUint8(offset+2, FormatId[attrib.format]);

        offset += 3;
      }
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
