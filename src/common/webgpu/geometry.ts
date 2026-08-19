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
 * The Geometry class manages the buffers and layouts for a piece of renderable
 * WebGPU geometry. It does not contain any rendering code, just the information
 * needed to bind the buffers for rendering.
 */

//import { GeometryBounds } from './geometry-bounds.js';
import { GeometryLayout } from './geometry-layout.js';

// The shader locations for each Geometry attribute.
export const AttribLocation: Record<string, number> = {
  position: 0,
  normal: 1,
  tangent: 2,
  texcoord0: 3,
  texcoord1: 4,
  color: 5,
  joints: 6,
  weights: 7,
};

/** One of the TypedArray types */
export type TypedArray = Float32Array | Float64Array |
                  Uint8Array | Int8Array |
                  Uint16Array | Int16Array |
                  Uint32Array | Int32Array;

/** Definition of an attribute for a Geometry */
export type GeometryAttributeValues = ArrayBuffer | TypedArray | number[];

/** Definition of an attribute for a Geometry */
export interface AttributeDescriptor {
  values: GeometryAttributeValues,
  offset?: number,
  stride?: number,
  format?: GPUVertexFormat,
};

export interface BufferAttributeDescriptor {
  buffer: GPUBuffer,
  format: GPUVertexFormat,
  offset: number,
  stride: number,
  size?: number
};

export interface BufferIndexDescriptor {
  buffer: GPUBuffer,
  format: GPUIndexFormat,
  offset: number,
  size?: number
};

/** Definition of an attribute for a Geometry */
export type GeometryAttribute = GeometryAttributeValues | AttributeDescriptor | BufferAttributeDescriptor;

/** Definition of indicies for a Geometry */
export type GeometryIndexValues = Uint8Array | Uint16Array | Uint32Array | number[];

/** Description of a Geometry to be created */
export interface GeometryDescriptor {
  label?: string,
  position?: GeometryAttribute,
  normal?: GeometryAttribute,
  tangent?: GeometryAttribute,
  texcoord0?: GeometryAttribute,
  texcoord1?: GeometryAttribute,
  color?: GeometryAttribute,
  joints?: GeometryAttribute,
  weights?: GeometryAttribute,
  indices?: GeometryIndexValues | BufferIndexDescriptor,
  topology?: GPUPrimitiveTopology,
  //bounds?: GeometryBounds,
  drawCount?: number,
  vertexCount?: number,
  vertexUsage?: GPUBufferUsageFlags,
  indexUsage?: GPUBufferUsageFlags
};

export interface GeometryVertexBinding {
  slot: GPUIndex32,
  buffer: GPUBuffer,
  offset: GPUSize64,
  size?: GPUSize64,
}

export interface GeometryIndexBinding {
  buffer: GPUBuffer,
  format: GPUIndexFormat,
  offset: GPUSize64,
  size?: GPUSize64,
}

export interface GeometryInit {
  layout: GeometryLayout,
  drawCount: number,
  vertexBindings: GeometryVertexBinding[],
  vertexCount: number,
  indexBinding?: GeometryIndexBinding,
  //bounds?: GeometryBounds,
  label?: string
}

export class Geometry implements GeometryInit {
  static SharedComponent = true;
  static #nextId = 1;

  layout: GeometryLayout;
  drawCount: number;
  vertexCount: number;
  vertexBindings: GeometryVertexBinding[];
  indexBinding?: GeometryIndexBinding;
  label?: string;
  //bounds: GeometryBounds;
  #id: number;

  /**
   * Create a new Geometry instance
   *
   * @param device - The GPUDevice to create the Geometry with
   * @param descriptor - Description of the Geometry to create
   */
  constructor(device: GPUDevice, descriptor: GeometryDescriptor | GeometryInit) {
    this.#id = Geometry.#nextId++;

    let init: GeometryInit;
    if ('layout' in descriptor) {
      init = descriptor as GeometryInit;
    } else {
      init = Geometry.#CreateBatchInit(device, [descriptor])[0];
    }

    this.layout = init.layout;
    this.drawCount = init.drawCount;
    this.vertexCount = init.vertexCount;
    this.vertexBindings = init.vertexBindings;
    this.indexBinding = init.indexBinding;
    //this.bounds = init.bounds;
    this.label = init.label;
  }

  /**
   * Creates multiple geometries as part of a single batch, enabling them to share GPUBuffers.
   */
  static CreateBatch(device: GPUDevice, descriptors: GeometryDescriptor[]): Geometry[] {
    const inits = Geometry.#CreateBatchInit(device, descriptors);

    const geometries = [];
    for (const init of inits) {
      geometries.push(new Geometry(device, init));
    }
    return geometries;
  }

  get id() { return this.#id; }

  /**
   * Binds the vertex and index buffers used by this geometry.
   * @param renderEncoder The RenderPassEncoder or RenderBundleEncoder to perform the binding with
   */
  bindBuffers(renderEncoder: GPURenderCommandsMixin) {
    for (const binding of this.vertexBindings) {
      renderEncoder.setVertexBuffer(binding.slot, binding.buffer, binding.offset, binding.size);
    }

    const index = this.indexBinding;
    if (index) {
      renderEncoder.setIndexBuffer(index.buffer, index.format, index.offset, index.size);
    }
  }

  /**
   * Executes a simple instanced draw or drawIndexed, depending on the contents of this geometry.
   * For more specialized needs call the appropriate function with `drawCount` directly.
   * @param renderEncoder The RenderPassEncoder or RenderBundleEncoder to perform the binding with
   * @param instanceCount The number of instances to draw
   */
  draw(renderEncoder: GPURenderCommandsMixin, instanceCount: GPUSize32 = 1, firstInstance: GPUSize32 = 0) {
    if (this.indexBinding) {
      renderEncoder.drawIndexed(this.drawCount, instanceCount, 0, 0, firstInstance);
    } else {
      renderEncoder.draw(this.drawCount, instanceCount, 0, firstInstance);
    }
  }

  /**
   * Binds the buffers used by this geometry and executes a simple instanced draw or drawIndexed
   * depending on the contents of this geometry.
   * @param renderEncoder The RenderPassEncoder or RenderBundleEncoder to perform the binding with
   * @param instanceCount The number of instances to draw
   */
  bindAndDraw(renderEncoder: GPURenderCommandsMixin, instanceCount: GPUSize32 = 1, firstInstance: GPUSize32 = 0) {
    this.bindBuffers(renderEncoder);
    this.draw(renderEncoder, instanceCount, firstInstance);
  }

  static #CreateBatchInit(device: GPUDevice, descriptors: GeometryDescriptor[]): GeometryInit[] {
    const batch = new GeometryAllocationBatch(descriptors);
    // Allocate GPUBuffers of the required size and copy all the array values
    // into them.
    let vertexBuffer: GPUBuffer | undefined;
    let vertexByteArray: Uint8Array;
    if (batch.requiredVertexBufferSize > 0) {
      vertexBuffer = device.createBuffer({
        label: 'GeometryBatch_VertexBuffer',
        size: batch.requiredVertexBufferSize,
        usage: batch.vertexUsage,
        mappedAtCreation: true,
      });
      vertexByteArray = new Uint8Array(vertexBuffer.getMappedRange());
    } else {
      vertexByteArray = new Uint8Array(0);
    }

    let indexBuffer: GPUBuffer | undefined;
    let indexByteArray: Uint8Array;
    if (batch.requiredIndexBufferSize > 0) {
      indexBuffer = device.createBuffer({
        label: 'GeometryBatch_IndexBuffer',
        size: batch.requiredIndexBufferSize,
        usage: batch.indexUsage,
        mappedAtCreation: true,
      });
      indexByteArray = new Uint8Array(indexBuffer.getMappedRange());
    } else {
      indexByteArray = new Uint8Array(0);
    }

    const geometries = [];
    for (const geometryInit of batch.geometryInits) {
      for (const source of geometryInit.vertexSources.values()) {
        if (source.byteArray && vertexByteArray) {
          vertexByteArray.set(source.byteArray, source.bufferOffset);
        }
      }

      const vertexBindings: GeometryVertexBinding[] = [];
      for (let i = 0; i < geometryInit.bufferLayouts.length; ++i) {
        const layout = geometryInit.bufferLayouts[i];
        vertexBindings.push({
          slot: i,
          buffer: layout.buffer?.buffer ?? vertexBuffer,
          offset: layout.bufferOffset ?? 0,
          size: layout.buffer.size,
        });
      }

      let indexBinding: GeometryIndexBinding | undefined;
      if (geometryInit.indexSource) {
        if (geometryInit.indexSource.byteArray) {
          indexByteArray.set(geometryInit.indexSource.byteArray, geometryInit.indexSource.bufferOffset);
        }

        indexBinding = {
          buffer: (geometryInit.indexSource?.buffer ?? indexBuffer) as GPUBuffer,
          format: geometryInit.indexFormat ?? 'uint16',
          offset: geometryInit.indexSource.bufferOffset,
          size: geometryInit.drawCount * (geometryInit.indexFormat == 'uint32' ? 4 : 2)
        };
      }

      geometries.push({
        layout: geometryInit.layout,
        drawCount: geometryInit.drawCount,
        vertexCount: geometryInit.vertexCount!,
        label: geometryInit.label,
        vertexBindings,
        indexBinding,
        //bounds: geometryInit.bounds,
      });
    }

    vertexBuffer?.unmap();
    indexBuffer?.unmap();

    return geometries;
  }
}

//
// Geometry Allocator logic below here
//

function nextMultipleOf(multiple: number, value: number): number {
  return Math.ceil(value / multiple) * multiple;
}

// The default format to use for any given attribute if an explicit format is not provided
const DefaultAttribFormat: Record<string, GPUVertexFormat> = {
  position: 'float32x3',
  normal: 'float32x3',
  tangent: 'float32x3',
  texcoord0: 'float32x2',
  texcoord1: 'float32x2',
  color: 'float32x4',
  joints: 'uint16x4',
  weights: 'float32x4',
};

// The default stride to use for any given format if an explicit stride is not provided
const DefaultStride: Record<string, number> = {
  uint8x2: 2,
  uint8x4: 4,
  sint8x2: 2,
  sint8x4: 4,
  unorm8x2: 2,
  unorm8x4: 4,
  snorm8x2: 2,
  snorm8x4: 4,
  uint16x2: 4,
  uint16x4: 8,
  sint16x2: 4,
  sint16x4: 8,
  unorm16x2: 4,
  unorm16x4: 8,
  snorm16x2: 4,
  snorm16x4: 8,
  float16x2: 4,
  float16x4: 8,
  float32: 4,
  float32x2: 8,
  float32x3: 12,
  float32x4: 16,
  uint32: 4,
  uint32x2: 8,
  uint32x3: 12,
  uint32x4: 16,
  sint32: 4,
  sint32x2: 8,
  sint32x3: 12,
  sint32x4: 16,
};

interface BufferArraySource {
  buffer?: GPUBuffer,
  byteArray?: Uint8Array
  bufferOffset: number,
};

interface BatchGeometryInit {
  layout: GeometryLayout,
  drawCount: number,
  vertexCount?: number,
  vertexSources: BufferArraySource[],
  bufferLayouts: BufferLayoutDesc[],
  indexSource?: BufferArraySource,
  indexFormat?: GPUIndexFormat,
  //bounds?: GeometryBounds,
  label?: string,
};

/**
 * Handles most of the organization work needed to easily create GPUBuffers for a batch of Geometry
 * by converting the geometry descriptions into a flatter structure indicating the buffers that need
 * to be created, grouping them as needed and possibly combining values from multiple Geometries so
 * that grouped elements (such as for a single level) can be efficiently allocated and uploaded into
 * a single buffer.
 */
class GeometryAllocationBatch {
  geometryInits: BatchGeometryInit[] = [];
  requiredVertexBufferSize: number = 0;
  requiredIndexBufferSize: number = 0;
  vertexUsage: GPUBufferUsageFlags = 0;
  indexUsage: GPUBufferUsageFlags = 0;

  constructor(descArray: GeometryDescriptor[]) {
    let bufferSources = 0;

    for (const desc of descArray) {
      let vertexBufferLayouts = [];
      let maxVertices = Number.MAX_SAFE_INTEGER;
      let arraySources = new Map();
      //let bounds = desc.bounds;

      // TODO: Warn if usages for a batch are different?
      this.vertexUsage |= desc.vertexUsage ?? GPUBufferUsage.VERTEX;
      this.indexUsage |= desc.indexUsage ?? GPUBufferUsage.INDEX;

      for (const attribName of Object.keys(AttribLocation)) {
        // @ts-expect-error
        const attrib = desc[attribName];
        if (attrib === undefined) { continue; }

        let offset = attrib.offset ?? 0;
        const format = attrib?.format ?? DefaultAttribFormat[attribName];
        const arrayStride = attrib?.stride ?? DefaultStride[format];
        const shaderLocation = AttribLocation[attribName];

        let source;
        if (attrib.buffer) {
          bufferSources++;
          source = arraySources.get(attrib.buffer);
          const size = attrib.size ?? attrib.buffer.size;
          if (!source) {
            source = {
              buffer: attrib.buffer,
              bufferOffset: attrib.offset,
              size,
            }
            arraySources.set(attrib.buffer, source);
          }

          // The maxVertices is the maximum number that could be rendered with the data we have,
          // so counterintuitively it' based on the byte array with the *smallest* number of
          // vertices in it, according to the stride.
          maxVertices = Math.min(maxVertices, size / arrayStride);
        } else {
          const values = attrib.values ?? attrib;

          // Figure out how much space each attribute will require. Does
          // some basic de-duping of attrib values to prevent the same array from
          // being uploaded twice.
          source = arraySources.get(values);
          if (!source) {
            let byteArray: Uint8Array;
            if (ArrayBuffer.isView(values)) {
              byteArray = new Uint8Array(values.buffer, values.byteOffset, values.byteLength);
            } else if (values instanceof ArrayBuffer) {
              byteArray = new Uint8Array(values);
            } else if (Array.isArray(values)) {
              // TODO: Should this be based on the attrib type?
              byteArray = new Uint8Array(new Float32Array(values).buffer);
            } else {
              throw new Error(`Unknown values type in attribute ${attribName}`);
            }

            source = {
              byteArray,
              bufferOffset: this.requiredVertexBufferSize,
              size: byteArray.byteLength,
            };
            arraySources.set(values, source);

            this.requiredVertexBufferSize += nextMultipleOf(4, byteArray.byteLength);

            // The maxVertices is the maximum number that could be rendered with the data we have,
            // so counterintuitively it' based on the byte array with the *smallest* number of
            // vertices in it, according to the stride.
            maxVertices = Math.min(maxVertices, byteArray.byteLength / arrayStride);
          }

          offset += source.bufferOffset;

          /*if (!bounds && attribName === 'position') {
            // Compute bounds if they weren't given.
            bounds = GeometryBounds.ComputeBounds(source.byteArray, arrayStride, format, desc.vertexCount ?? maxVertices);
          }*/
        }

        vertexBufferLayouts.push({
          buffer: source,
          arrayStride,
          attributes: [{
            shaderLocation,
            format,
            offset,
          }]
        });
      }

      const vertexCount = desc.vertexCount ?? maxVertices;

      if (vertexCount > maxVertices) {
        console.warn(`The given number of vertices for this geometry (${vertexCount}) is greater than the
          maximum number of vertices provided by the passed arrays (${maxVertices}).`);
      }

      // If no bounds were provided and a position attribute isn't given create an empty bounds just
      // to prevent null reference errors.
      /*if (!bounds) {
        bounds = new GeometryBounds({ min: [0, 0, 0], max: [0, 0, 0] });
      }*/

      const bufferLayouts = NormalizeBufferLayout([...vertexBufferLayouts.values()]);

      // Create and fill the index buffer
      let indexSource: BufferArraySource | undefined;
      let indexCount = 0;
      let indexFormat: GPUIndexFormat | undefined;

      if (desc.indices) {
        if ('format' in desc.indices) {
          const indices = desc.indices as BufferIndexDescriptor;
          indexSource = {
            buffer: indices.buffer,
            bufferOffset: indices.offset,
          };
          indexFormat = indices.format;
          indexCount = (indices.size ?? indices.buffer.size) / (indexFormat == 'uint32' ? 4 : 2);
        } else {
          const indices = desc.indices as GeometryIndexValues;
          indexSource = {
            byteArray: undefined,
            bufferOffset: this.requiredIndexBufferSize
          };

          if (Array.isArray(indices)) {
            indexSource.byteArray = new Uint8Array(new Uint32Array(indices).buffer);
            indexCount = indices.length;
            indexFormat = 'uint32';
          } else if (indices instanceof Uint32Array) {
            indexSource.byteArray = new Uint8Array(indices.buffer, indices.byteOffset, indices.byteLength);
            indexCount = desc.indices.length;
            indexFormat = 'uint32';
          } else if (indices instanceof Uint16Array) {
            indexSource.byteArray = new Uint8Array(indices.buffer, indices.byteOffset, indices.byteLength);
            indexCount = indices.length;
            indexFormat = 'uint16';
          } else if (indices instanceof Uint8Array) {
            // Automatically expand 8 bit indicies into 16 bit
            const indexShortArray = new Uint16Array(indices.length);
            indexShortArray.set(indices);
            indexSource.byteArray = new Uint8Array(indexShortArray.buffer);
            indexFormat = 'uint16';
          } else {
            throw new Error(`Unknown indices type`);
          }

          this.requiredIndexBufferSize += nextMultipleOf(4, indexSource.byteArray.byteLength);
        }
      }

      const layout = new GeometryLayout(bufferLayouts, desc.topology ?? 'triangle-list', indexFormat);

      let drawCount = desc.drawCount;
      if (drawCount === undefined) {
        if (indexSource) {
          drawCount = indexCount;
        } else if (arraySources.size > 0) {
          drawCount = vertexCount;
        } else {
          throw new Error('drawCount must be defined if no attributes or indices are given');
        }
      }

      this.geometryInits.push({
        layout,
        drawCount,
        vertexCount,
        vertexSources: [ ...arraySources.values() ],
        bufferLayouts,
        indexSource,
        indexFormat,
        //bounds,
        label: desc.label,
      });
    }

    if (this.requiredVertexBufferSize == 0 && bufferSources == 0) {
      throw new Error('No vertex data provided');
    }
  }
}

interface BufferLayoutDesc extends GPUVertexBufferLayout {
  buffer: any;
  bufferOffset?: number;
  bufferSize?: number;
};

// Takes in an array of layouts including the buffer, buffer offset, stride, and
// attributes. Then it returns the same but reorganized and possibly combined. The output array
// may not have the same number of elements as the input array, and the buffers may have different
// offsets than the ones specified in the inputs! Also, the buffer passed in does not need to be a
// GPUBuffer, it can be any value you want (such as an index) that can be used as a Map key.
function NormalizeBufferLayout(bufferLayouts: BufferLayoutDesc[]): BufferLayoutDesc[] {
  // Do a first pass over the inputs to sort first by buffer, then by stride.
  const bufferStrideAttribs = new Map();
  for (const layout of bufferLayouts) {
    // Skip any buffers that don't have attributes. (Why did you even define that buffer?)
    if ((layout.attributes as []).length == 0) {
      continue;
    }

    let bufferStrides = bufferStrideAttribs.get(layout.buffer);
    if (!bufferStrides) {
      bufferStrides = new Map();
      bufferStrideAttribs.set(layout.buffer, bufferStrides);
    }

    let strideAttribs: GPUVertexAttribute[] = bufferStrides.get(layout.arrayStride);
    if (!strideAttribs) {
      strideAttribs = [];
      bufferStrides.set(layout.arrayStride, strideAttribs);
    }

    for (const attrib of layout.attributes) {
      // The buffer and attribute offsets
      strideAttribs.push({
        shaderLocation: attrib.shaderLocation,
        offset: attrib.offset + (layout.bufferOffset ?? 0),
        format: attrib.format,
      });
    }
  }

  const normalizedLayouts: BufferLayoutDesc[] = [];
  const pushLayout = (buffer: any, bufferOffset: number, arrayStride: number, attributes: GPUVertexAttribute[]) => {
    normalizedLayouts.push({
      buffer,
      bufferOffset,
      arrayStride,
      attributes: attributes.sort((a, b) => a.shaderLocation - b.shaderLocation)
    });
  }

  // Now, for each buffer/stride combo find the minimum offset used by any of the attributes and treat that as the
  // buffer binding offset instead. Then split any buffers where the adjusted offset is greater than the
  // stride into separate buffers.
  for (const [buffer, strideAttribs] of bufferStrideAttribs) {
    for (const [stride, attribs] of strideAttribs) {
      // Sort the attributes by offset so that interleaved attributes are grouped.
      attribs.sort((a: GPUVertexAttribute, b: GPUVertexAttribute) => a.offset - b.offset);

      // Get the minimum offset from all of the attributes. That will be the final buffer offset.
      let minAttribOffset = attribs[0].offset;

      let attributes: GPUVertexAttribute[] = [];
      for (const attrib of attribs) {
        let adjustedOffset = attrib.offset - minAttribOffset;

        // Sometimes attribs will be fed in that are separate arrays but packed into the same buffer.
        // If the offset is greater than the stride, just treat it as a new buffer with the bigger
        // offset as the base.
        if (adjustedOffset >= stride) {
          pushLayout(buffer, minAttribOffset, stride, attributes);

          minAttribOffset = attrib.offset;
          adjustedOffset = 0;
          attributes = [];
        }

        attributes.push({
          offset: adjustedOffset,
          shaderLocation: attrib.shaderLocation,
          format: attrib.format,
        });
      }

      pushLayout(buffer, minAttribOffset, stride, attributes);
    }
  }

  // Finally, sort the buffer layouts by their first attribute's shader location and return.
  return normalizedLayouts.sort((a, b) => a.attributes[0].shaderLocation - b.attributes[0].shaderLocation);
}