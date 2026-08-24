import { Mat4 } from "gl-matrix";
import { Actor } from "./common/actor.ts";
import { Geometry } from "./common/webgpu/geometry.ts";
import { MaterialBase } from "./common/webgpu/materials/material-base.ts";
import { WebGPURenderer } from "./webgpu-renderer.ts";

function nextMultipleOf(multiple: number, value: number): number {
  return Math.ceil(value / multiple) * multiple;
}

export class GeometryInstances {
  geometry: Geometry;
  instances: Actor[] = [];
  indexOffset: number = -1;

  constructor(geometry: Geometry) {
    this.geometry = geometry;
  }

  addInstance(actor: Actor) {
    this.instances.push(actor);
  }

  get instanceCount() {
    return this.instances.length;
  }
}

export class MaterialGeometries {
  material: MaterialBase;
  geometries: Map<Geometry, GeometryInstances> = new Map();
  instanceCount: number = 0;

  constructor(material: MaterialBase) {
    this.material = material;
  }

  addInstance(geometry: Geometry, actor: Actor) {
    let geometryInstances = this.geometries.get(geometry);
    if (!geometryInstances) {
      geometryInstances = new GeometryInstances(geometry);
      this.geometries.set(geometry, geometryInstances);
    }
    geometryInstances.addInstance(actor);
    this.instanceCount++;
  }
}

export class InstanceBuffers {
  gpu: WebGPURenderer;

  maxInstanceCount: number;

  instanceTransformArray: Float32Array;
  instanceIndexArray: Uint32Array;

  instanceTransformBuffer: GPUBuffer;
  instanceIndexBuffer: GPUBuffer;

  instanceBindGroup: GPUBindGroup;

  constructor(gpu: WebGPURenderer, maxInstanceCount: number) {
    this.gpu = gpu;
    this.maxInstanceCount = maxInstanceCount;

    this.instanceTransformArray = new Float32Array(maxInstanceCount * 16);
    this.instanceIndexArray = new Uint32Array(maxInstanceCount);

    this.instanceTransformBuffer = gpu.device.createBuffer({
      label: 'Instance Transform Buffer',
      size: this.instanceTransformArray.byteLength,
      usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.STORAGE
    });

    this.instanceIndexBuffer = gpu.device.createBuffer({
      label: 'Instance Index Buffer',
      size: this.instanceIndexArray.byteLength,
      usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.STORAGE
    });

    this.instanceBindGroup = gpu.device.createBindGroup({
      label: 'Instance',
      layout: gpu.instanceBGL,
      entries: [{
        binding: 0,
        resource: this.instanceTransformBuffer,
      }, {
        binding: 1,
        resource: this.instanceIndexBuffer
      }]
    });
  }

  update(materials: Map<MaterialBase, MaterialGeometries>) {
    let transformOffset = 0;
    let indexOffset = 0;

    // Build up the arrays that will populate the instance buffers
    for (let materialGeometries of materials.values()) {
      for (let geometryInstances of materialGeometries.geometries.values()) {
        geometryInstances.indexOffset = indexOffset;
        for (let instance of geometryInstances.instances) {
          this.instanceTransformArray.set(instance.worldTransform.matrix, transformOffset);
          this.instanceIndexArray[indexOffset] = indexOffset++; // TODO: Can definitely do better here.
          transformOffset += 16;
        }
      }
    }

    this.gpu.device.queue.writeBuffer(this.instanceTransformBuffer, 0, this.instanceTransformArray, 0, transformOffset);
    this.gpu.device.queue.writeBuffer(this.instanceIndexBuffer, 0, this.instanceIndexArray, 0, indexOffset);
  }
}

export class InstanceManager {
  gpu: WebGPURenderer;

  materials: Map<MaterialBase, MaterialGeometries> = new Map();
  instanceCount: number = 0;
  instanceBuffers?: InstanceBuffers;

  constructor(gpu: WebGPURenderer) {
    this.gpu = gpu;
  }

  clear() {
    this.materials.clear();
    this.instanceCount = 0;
  }

  addInstance(material: MaterialBase, geometry: Geometry, actor: Actor) {
    let materialGeometries = this.materials.get(material);
    if (!materialGeometries) {
      materialGeometries = new MaterialGeometries(material);
      this.materials.set(material, materialGeometries);
    }
    materialGeometries.addInstance(geometry, actor);
    this.instanceCount++;
  }

  updateBuffers() {
    if (!this.instanceBuffers || this.instanceBuffers.maxInstanceCount < this.instanceCount) {
      this.instanceBuffers = new InstanceBuffers(this.gpu, nextMultipleOf(128, this.instanceCount));
    }
    this.instanceBuffers.update(this.materials);
  }
}