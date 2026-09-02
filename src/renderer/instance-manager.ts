import { Mat3, Mat4 } from "gl-matrix";
import { Actor } from "../core/actor.ts";
import { Geometry } from "../geometry/geometry.ts";
import { ActorMaterial, MaterialBase } from "../materials/material-base.ts";
import { WebGPURenderer } from "./webgpu-renderer.ts";
import { Stage } from "../core/stage.ts";

function nextMultipleOf(multiple: number, value: number): number {
  return Math.ceil(value / multiple) * multiple;
}

export class GeometryInstances {
  geometry: Geometry;
  instances: Actor[] = [];
  mirroredInstances: Actor[] = [];
  indexOffset: number = -1;
  mirroredIndexOffset: number = -1;

  constructor(geometry: Geometry) {
    this.geometry = geometry;
  }

  addInstance(actor: Actor) {
    if (actor.worldTransform.mirrored) {
      this.mirroredInstances.push(actor);
    } else {
      this.instances.push(actor);
    }
  }

  get instanceCount() {
    return this.instances.length;
  }

  get mirroredInstanceCount() {
    return this.mirroredInstances.length;
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

    this.instanceTransformArray = new Float32Array(maxInstanceCount * 28); // Mat4 + (Mat3 with 4th padding element per row).
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

    const setNormalMat = (normal: Mat3, offset: number) => {
      this.instanceTransformArray[offset+0] = normal[0];
      this.instanceTransformArray[offset+1] = normal[1];
      this.instanceTransformArray[offset+2] = normal[2];

      this.instanceTransformArray[offset+4] = normal[3];
      this.instanceTransformArray[offset+5] = normal[4];
      this.instanceTransformArray[offset+6] = normal[5];

      this.instanceTransformArray[offset+8] = normal[6];
      this.instanceTransformArray[offset+9] = normal[7];
      this.instanceTransformArray[offset+10] = normal[8];
    }

    // Build up the arrays that will populate the instance buffers
    for (let materialGeometries of materials.values()) {
      for (let geometryInstances of materialGeometries.geometries.values()) {
        if (geometryInstances.instances.length) {
          geometryInstances.indexOffset = indexOffset;
          for (let instance of geometryInstances.instances) {
            this.instanceTransformArray.set(instance.worldTransform.matrix, transformOffset);
            setNormalMat(instance.worldTransform.normalMatrix, transformOffset + 16);
            this.instanceIndexArray[indexOffset] = indexOffset++; // TODO: Can definitely do better here.
            transformOffset += 28;
          }
        }
        if (geometryInstances.mirroredInstances) {
          geometryInstances.mirroredIndexOffset = indexOffset;
          for (let instance of geometryInstances.mirroredInstances) {
            this.instanceTransformArray.set(instance.worldTransform.matrix, transformOffset);
            setNormalMat(instance.worldTransform.normalMatrix, transformOffset + 16);
            this.instanceIndexArray[indexOffset] = indexOffset++; // TODO: Can definitely do better here.
            transformOffset += 28;
          }
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

  #clear() {
    this.materials.clear();
    this.instanceCount = 0;
  }

  #addInstance(material: MaterialBase, geometry: Geometry, actor: Actor) {
    let materialGeometries = this.materials.get(material);
    if (!materialGeometries) {
      materialGeometries = new MaterialGeometries(material);
      this.materials.set(material, materialGeometries);
    }
    materialGeometries.addInstance(geometry, actor);
    this.instanceCount++;
  }

  updateInstances(stage: Stage) {
    this.#clear();
    stage.query(Geometry, ActorMaterial).forEach((actor: Actor, geometry: Geometry, material: ActorMaterial) => {
      // Build the buffers/bind groups neccessary for rendering any instances of the gemoetry/material combinations.
      // TODO: This sucks but I'm forcing myself to ignore that until it actually becomes a problem for the sake of getting anything else done.
      this.#addInstance(material.material, geometry, actor);
    });

    if (this.instanceCount == 0) {
      return;
    }

    if (!this.instanceBuffers || this.instanceBuffers.maxInstanceCount < this.instanceCount) {
      this.instanceBuffers = new InstanceBuffers(this.gpu, nextMultipleOf(128, this.instanceCount));
    }
    this.instanceBuffers.update(this.materials);
  }
}