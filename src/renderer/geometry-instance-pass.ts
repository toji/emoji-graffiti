import { MaterialBase } from "../materials/material-base.ts";
import { AttachmentLayout } from "./attachment-layout.ts";
import { GeometryInstances, InstanceManager } from "./instance-manager.ts";
import { RenderPipeline, RenderPipelineFactory } from "./pipeline-factory.ts";

export type PassMaterialArgs = { pipelineFactory: any, onInstancePipelineArgs: PipelineArgsCallback, onBindMaterial?: MaterialBindCallback };
export type PassMaterialCallback = (material: MaterialBase) => PassMaterialArgs | undefined;
export type MaterialBindCallback = (renderPass: GPURenderPassEncoder, material: MaterialBase) => void;
export type PipelineArgsCallback = (geometryInstances: GeometryInstances) => any | undefined;

class GeometryInstancePipelineCache {
  #cache: Map<number, RenderPipeline | null> = new Map();
  material: MaterialBase;
  attachmentLayout: AttachmentLayout;
  passMaterialArgs: PassMaterialArgs;

  constructor(material: MaterialBase, passMaterialArgs: PassMaterialArgs, attachmentLayout: AttachmentLayout) {
    this.material = material;
    this.passMaterialArgs = passMaterialArgs;
    this.attachmentLayout = attachmentLayout;
    this.passMaterialArgs.pipelineFactory.config.addEventListener('changed', () => {
      this.#cache = new Map();
    });
  }

  getPipeline(geometryInstances: GeometryInstances, forceSync: boolean = false): RenderPipeline | null {
    let pipeline = this.#cache.get(geometryInstances.id);
    if (pipeline === undefined) {
      const pipelineArgs = this.passMaterialArgs.onInstancePipelineArgs(geometryInstances);
      if (!pipelineArgs) {
        this.#cache.set(geometryInstances.id, null);
        return null;
      }
      pipeline = this.passMaterialArgs.pipelineFactory.getPipeline(geometryInstances.geometry.layout, this.attachmentLayout, pipelineArgs, forceSync);
      this.#cache.set(geometryInstances.id, pipeline!);
    }
    return pipeline!;
  }

  onBindMaterial(renderPass: GPURenderPassEncoder) {
    this.passMaterialArgs.onBindMaterial?.(renderPass, this.material);
  }
}

/**
 * Simplifies management, pipeline caching, and execution of rendering a set of GeometryInstances
 * from an InstanceManager. Uses callbacks to filter
 * @example
 * const forwardPass = new GeometryInstancePass(attachmentLayout, (material: MaterialBase) => {
 *    if (material instanceof UnlitMaterial) {
 *     return {
 *       pipelineFactory: unlitPipelineFactory,
 *       onBindMaterial(renderPass: GPURenderPassEncoder, material: MaterialBase) {
 *         renderPass.setBindGroup(1, (material as UnlitMaterial).materialBindGroup);
 *       },
 *       onInstancePipelineArgs: (geometryInstances: GeometryInstances) => {
 *         if (geometryInstances.mirrored) { return; } // Filtered out.
 *         return new UnlitPipelineArgs({
 *           material,
 *           depthPrepass: false,
 *         });
 *       }
 *     };
 *   } else if (material instanceof PBRMaterial) {
 *     return {
 *       pipelineFactory: this.pbrPipelineFactory,
 *       onBindMaterial(renderPass: GPURenderPassEncoder, material: MaterialBase) {
 *         renderPass.setBindGroup(1, (material as PBRMaterial).materialBindGroup);
 *       },
 *       onInstancePipelineArgs: () => new PBRPipelineArgs({material})
 *     };
 *   }
 *   // All other materials get filtered out.
 * });
 *
 * forwardPass.drawGeometryInstances(renderPass, instanceManager);
 */
export class GeometryInstancePass {
  #attachmentLayout: AttachmentLayout;
  #materialCallback: PassMaterialCallback;

  #materialPipelineCache: Map<number, GeometryInstancePipelineCache | null> = new Map();

  constructor(attachmentLayout: AttachmentLayout, materialCallback: PassMaterialCallback) {
    this.#attachmentLayout = attachmentLayout;
    this.#materialCallback = materialCallback;
  }

  // Ensures that pipelines are generated for all of the material/geometry combinations in the
  // instanceManager without actually drawing them. Returns a promise that resolves when all of
  // the pipelines are ready to use.
  precacheGeometryInstancePipelines(instanceManager: InstanceManager) {
    const pipelinePromises: Promise<GPURenderPipeline>[] = [];
    for (let layout of instanceManager.layouts.values()) {
      for (let materialGeometries of layout.materialInstances.values()) {
        const cache = this.#getGeometryInstancePipelineCache(materialGeometries.material);
        if (cache) {
          for (let geometryInstances of materialGeometries.geometryInstances.values()) {
            const pipeline = cache.getPipeline(geometryInstances);
            if (pipeline) {
              pipelinePromises.push(pipeline.promise);
            }
          }
        }
      }
    }
    return Promise.all(pipelinePromises);
  }

  // Draw all of the material/geometry combintations in the instanceManager.
  drawGeometryInstances(renderPass: GPURenderPassEncoder, instanceManager: InstanceManager, forceSync: boolean = false) {
    for (let layout of instanceManager.layouts.values()) {
      for (let materialGeometries of layout.materialInstances.values()) {
        const cache = this.#getGeometryInstancePipelineCache(materialGeometries.material);
        if (cache) {
          cache.onBindMaterial(renderPass);
          for (let geometryInstances of materialGeometries.geometryInstances.values()) {
            const pipeline = cache.getPipeline(geometryInstances, forceSync);
            if (pipeline) {
              pipeline.use(renderPass);
              geometryInstances.geometry.bindAndDraw(renderPass, geometryInstances.instanceCount, geometryInstances.indexOffset);
            }
          }
        }
      }
    }
  }

  #getGeometryInstancePipelineCache(material: MaterialBase): GeometryInstancePipelineCache | null {
    let cache = this.#materialPipelineCache.get(material.id);
    if (cache === undefined) {
      const passMaterialArgs = this.#materialCallback(material);
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