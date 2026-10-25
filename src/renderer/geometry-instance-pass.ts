import { MaterialBase } from "../materials/material-base.ts";
import { AttachmentLayout } from "./attachment-layout.ts";
import { GeometryInstances, InstanceManager } from "./instance-manager.ts";
import { RenderPipeline, RenderPipelineFactory } from "./pipeline-factory.ts";

// TODO: Better naming all around
export type PassMaterialArgs = { pipelineFactory: any, filter: GeometryFilter, onBindMaterial?: MaterialBindCallback };
export type MaterialFilter = (material: MaterialBase) => PassMaterialArgs | undefined;
export type MaterialBindCallback = (renderPass: GPURenderPassEncoder, material: MaterialBase) => void;
export type GeometryFilter = (geometryInstances: GeometryInstances) => any | undefined;

class GeometryInstancePipelineCache {
  #cache: Map<number, RenderPipeline | null> = new Map();
  material: MaterialBase;
  attachmentLayout: AttachmentLayout;
  passMaterialArgs: PassMaterialArgs;

  constructor(material: MaterialBase, passMaterialArgs: PassMaterialArgs, attachmentLayout: AttachmentLayout) {
    this.material = material;
    this.passMaterialArgs = passMaterialArgs;
    this.attachmentLayout = attachmentLayout;
  }

  getPipeline(geometryInstances: GeometryInstances): RenderPipeline | null {
    let pipeline = this.#cache.get(geometryInstances.id);
    if (pipeline === undefined) {
      const pipelineArgs = this.passMaterialArgs.filter(geometryInstances);
      if (!pipelineArgs) {
        this.#cache.set(geometryInstances.id, null);
        return null;
      }
      pipeline = this.passMaterialArgs.pipelineFactory.getPipeline(geometryInstances.geometry.layout, this.attachmentLayout, pipelineArgs);
      this.#cache.set(geometryInstances.id, pipeline!);
    }
    return pipeline!;
  }

  onBindMaterial(renderPass: GPURenderPassEncoder) {
    this.passMaterialArgs.onBindMaterial?.(renderPass, this.material);
  }
}

type MaterialPipelineCache = Map<number, GeometryInstancePipelineCache | null>;

export class GeometryInstancePass {
  #attachmentLayout: AttachmentLayout;
  #materialFilter: MaterialFilter;

  #materialPipelineCache: MaterialPipelineCache = new Map();

  constructor(attachmentLayout: AttachmentLayout, materialFilter: MaterialFilter) {
    this.#attachmentLayout = attachmentLayout;
    this.#materialFilter = materialFilter;
  }

  drawGeometryInstances(renderPass: GPURenderPassEncoder, instanceManager: InstanceManager) {
    for (let materialGeometries of instanceManager.materials.values()) {
      // Filter by material?
      const cache = this.#getGeometryInstancePipelineCache(materialGeometries.material);
      if (cache) {
        cache.onBindMaterial(renderPass);
        for (let geometryInstances of materialGeometries.geometryInstances.values()) {
          const pipeline = cache.getPipeline(geometryInstances);
          if (pipeline) {
            pipeline.use(renderPass);
            geometryInstances.geometry.bindAndDraw(renderPass, geometryInstances.instanceCount, geometryInstances.indexOffset);
          }
        }
      }
    }
  }

  #getGeometryInstancePipelineCache(material: MaterialBase): GeometryInstancePipelineCache | null {
    let cache = this.#materialPipelineCache.get(material.id);
    if (cache === undefined) {
      const passMaterialArgs = this.#materialFilter(material);
      if (!passMaterialArgs) {
        this.#materialPipelineCache.set(material.id, null);
        return null;
      }
      cache = new GeometryInstancePipelineCache(material, passMaterialArgs, this.#attachmentLayout);
      this.#materialPipelineCache.set(material.id, cache);
    }
    return cache;
  }
}