import { Mat3, Mat4 } from "gl-matrix";
import { Actor } from "../core/actor.ts";
import { Geometry } from "../geometry/geometry.ts";
import { ActorMaterial, MaterialBase } from "../materials/material-base.ts";
import { WebGPURenderer } from "./webgpu-renderer.ts";
import { Stage } from "../core/stage.ts";
import { GeometryLayout } from "../geometry/geometry-layout.ts";

function nextMultipleOf(multiple: number, value: number): number {
  return Math.ceil(value / multiple) * multiple;
}

export class GeometryInstances {
  id: number;
  geometry: Geometry;
  instances: Actor[] = [];
  mirrored: boolean = false;
  indexOffset: number = -1;

  constructor(geometry: Geometry, mirrored: boolean = false) {
    this.geometry = geometry;
    this.mirrored = mirrored;
    this.id = this.geometry.id * (mirrored ? -1 : 1);
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
  geometryInstances: Map<number, GeometryInstances> = new Map();
  instanceCount: number = 0;

  constructor(material: MaterialBase) {
    this.material = material;
  }

  addInstance(geometry: Geometry, actor: Actor) {
    const mirrored = actor.worldTransform.mirrored;
    const id = geometry.id * (mirrored ? -1 : 1);
    let geometryInstances = this.geometryInstances.get(id);
    if (!geometryInstances) {
      geometryInstances = new GeometryInstances(geometry, mirrored);
      this.geometryInstances.set(id, geometryInstances);
    }
    geometryInstances.addInstance(actor);
    this.instanceCount++;
  }
}

export class GeometryLayoutInstances {
  layout: GeometryLayout;
  materialInstances: Map<number, MaterialGeometries> = new Map();
  instanceCount: number = 0;

  constructor(layout: GeometryLayout) {
    this.layout = layout;
  }

  addInstance(material: MaterialBase, geometry: Geometry, actor: Actor) {
    let materialInstances = this.materialInstances.get(material.id);
    if (!materialInstances) {
      materialInstances = new MaterialGeometries(material);
      this.materialInstances.set(material.id, materialInstances);
    }
    materialInstances.addInstance(geometry, actor);
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
  }

  update(layoutInstances: Iterable<GeometryLayoutInstances>) {
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
    for (let layout of layoutInstances) {
      for (let materialGeometries of layout.materialInstances.values()) {
        for (let geometryInstances of materialGeometries.geometryInstances.values()) {
          geometryInstances.indexOffset = indexOffset;
          for (let instance of geometryInstances.instances) {
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

  layouts: Map<number, GeometryLayoutInstances> = new Map();
  instanceCount: number = 0;
  instanceBuffers?: InstanceBuffers;

  constructor(gpu: WebGPURenderer) {
    this.gpu = gpu;
  }

  #clear() {
    this.layouts.clear();
    this.instanceCount = 0;
  }

  #addInstance(material: MaterialBase, geometry: Geometry, actor: Actor) {
    let layoutInstances = this.layouts.get(geometry.layout.id);
    if (!layoutInstances) {
      layoutInstances = new GeometryLayoutInstances(geometry.layout);
      this.layouts.set(geometry.layout.id, layoutInstances);
    }
    layoutInstances.addInstance(material, geometry, actor);
    this.instanceCount++;
  }

  updateInstances(stage: Stage) {
    this.#clear();
    stage.query(Geometry, ActorMaterial).forEach((actor: Actor, geometry: Geometry, material: ActorMaterial) => {
      // Build the buffers/bind groups neccessary for rendering any instances of the gemoetry/material combinations.
      // TODO: This sucks but I'm forcing myself to ignore that until it actually becomes a problem for the sake of getting anything else done.
      this.#addInstance(material.material, geometry, actor);
    });

    if (!this.instanceBuffers || this.instanceBuffers.maxInstanceCount < this.instanceCount) {
      this.instanceBuffers = new InstanceBuffers(this.gpu, nextMultipleOf(128, this.instanceCount));
      this.gpu.frameBindingsDirty();
    }
    this.instanceBuffers.update(this.layouts.values());
  }
}