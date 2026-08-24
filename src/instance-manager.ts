import { Geometry } from "./common/webgpu/geometry.ts";
import { MaterialBase } from "./common/webgpu/materials/material-base.ts";
import { WebGPURenderer } from "./webgpu-renderer.ts";

export class GeometryInstance {
  geometry: Geometry;
  material: MaterialBase;

  constructor(geometry: Geometry, material: MaterialBase) {
    this.geometry = geometry;
    this.material = material;
  }
}

export class InstanceManager {
  gpu: WebGPURenderer;

  instanceArray = new Float32Array

  constructor(gpu: WebGPURenderer) {
    this.gpu = gpu;


  }

  clear() {

  }
}