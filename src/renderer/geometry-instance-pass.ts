import { GeometryLayout } from "../geometry/geometry-layout.ts";
import { MaterialBase } from "../materials/material-base.ts";
import { AttachmentLayout } from "./attachment-layout.ts";
import { GeometryInstances, InstanceManager, MaterialGeometries } from "./instance-manager.ts";
import { RenderPipeline, RenderPipelineFactory } from "./pipeline-factory.ts";

//export type PassMaterialArgs = { pipelineFactory: any, onInstancePipelineArgs: PipelineArgsCallback, onBindMaterial?: MaterialBindCallback };
export type PassMaterialCallback = (material: MaterialBase) => PassMaterialArgs | undefined;
export type MaterialBindCallback = (renderPass: GPURenderPassEncoder, material: MaterialBase) => void;
export type PipelineArgsCallback = (geometryInstances: GeometryInstances) => any | undefined;

export interface PassMaterialArgs {
  pipelineFactory: any,
  pipelineArgs: any,
  onBindMaterial?: MaterialBindCallback,
}

interface MaterialPipeline {
  pipeline?: RenderPipeline,
  mirroredPipeline?: RenderPipeline,
  onBindMaterial?: MaterialBindCallback,
}

class MaterialPipelineCache {
  #cache: Map<number, MaterialPipeline | null> = new Map();
  #geometryLayout: GeometryLayout;
  #attachmentLayout: AttachmentLayout;
  #materialCallback: PassMaterialCallback;
  #pipelineFactories: Set<any> = new Set();

  constructor(geometryLayout: GeometryLayout, attachmentLayout: AttachmentLayout, materialCallback: PassMaterialCallback) {
    this.#geometryLayout = geometryLayout;
    this.#attachmentLayout = attachmentLayout;
    this.#materialCallback = materialCallback;
  }

  getPipeline(materialGeometries: MaterialGeometries, forceSync: boolean = false): MaterialPipeline | null {
    const material = materialGeometries.material;
    let materialPipeline = this.#cache.get(material.id);
    if (materialPipeline === undefined) {
      const passMaterialArgs = this.#materialCallback(material);
      if (!passMaterialArgs) {
        this.#cache.set(material.id, null);
        return null;
      }
      materialPipeline = {
        onBindMaterial: passMaterialArgs.onBindMaterial,
      };
      if (!this.#pipelineFactories.has(passMaterialArgs.pipelineFactory)) {
        passMaterialArgs.pipelineFactory.config.addEventListener('changed', () => {
          this.#cache = new Map();
          this.#pipelineFactories = new Set();
        });
      }
      if (materialGeometries.hasNonMirroredInstances) {
        materialPipeline.pipeline = passMaterialArgs.pipelineFactory.getPipeline({
          geometryLayout: this.#geometryLayout,
          attachmentLayout: this.#attachmentLayout,
          args: passMaterialArgs.pipelineArgs,
          forceSync
        });
      }
      if (materialGeometries.hasMirroredInstances) {
        materialPipeline.mirroredPipeline = passMaterialArgs.pipelineFactory.getPipeline({
          geometryLayout: this.#geometryLayout,
          attachmentLayout: this.#attachmentLayout,
          args: passMaterialArgs.pipelineArgs,
          mirrored: true,
          forceSync
        });
      }

      this.#cache.set(material.id, materialPipeline);
    }

    return materialPipeline!;
  }
}

/**
 * Simplifies management, pipeline caching, and execution of rendering a set of GeometryInstances
 * from an InstanceManager. Uses callbacks to indicate what pipelines to use per-material, or to
 * filter out some materials from the pass entirely.
 * @example
 * const forwardPass = new GeometryInstancePass(attachmentLayout, (material: MaterialBase) => {
 *   if (material instanceof UnlitMaterial) {
 *     return {
 *       pipelineFactory: unlitPipelineFactory,
 *       pipelineArgs: new UnlitPipelineArgs({
 *         material,
 *         depthPrepass: false,
 *       }),
 *       onBindMaterial(renderPass: GPURenderPassEncoder, material: MaterialBase) {
 *         renderPass.setBindGroup(1, (material as UnlitMaterial).materialBindGroup);
 *       },
 *     };
 *   } else if (material instanceof PBRMaterial) {
 *     return {
 *       pipelineFactory: this.pbrPipelineFactory,
 *       pipelineArgs: new PBRPipelineArgs({material}),
 *       onBindMaterial(renderPass: GPURenderPassEncoder, material: MaterialBase) {
 *         renderPass.setBindGroup(1, (material as PBRMaterial).materialBindGroup);
 *       },
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

  #layoutPipelineCache: Map<number, MaterialPipelineCache> = new Map();

  constructor(attachmentLayout: AttachmentLayout, materialCallback: PassMaterialCallback) {
    this.#attachmentLayout = attachmentLayout;
    this.#materialCallback = materialCallback;
  }

  // Ensures that pipelines are generated for all of the material/geometry combinations in the
  // instanceManager without actually drawing them. Returns a promise that resolves when all of
  // the pipelines are ready to use.
  precacheGeometryInstancePipelines(instanceManager: InstanceManager) {
    const pipelinePromises: Promise<GPURenderPipeline>[] = [];
    for (let layoutInstances of instanceManager.layouts.values()) {
      const materialCache = this.#getMaterialPipelineCache(layoutInstances.layout);
      for (let materialGeometries of layoutInstances.materialInstances.values()) {
        const materialPipeline = materialCache.getPipeline(materialGeometries);
        if (materialPipeline?.pipeline) {
          pipelinePromises.push(materialPipeline.pipeline.promise);
        }
        if (materialPipeline?.mirroredPipeline) {
          pipelinePromises.push(materialPipeline.mirroredPipeline.promise);
        }
      }
    }
    return Promise.all(pipelinePromises);
  }

  // Draw all of the material/geometry combintations in the instanceManager.
  drawGeometryInstances(renderPass: GPURenderPassEncoder, instanceManager: InstanceManager, forceSync: boolean = false) {
    let lastPipeline: RenderPipeline | undefined;
    for (let layoutInstances of instanceManager.layouts.values()) {
      const materialCache = this.#getMaterialPipelineCache(layoutInstances.layout);
      for (let materialGeometries of layoutInstances.materialInstances.values()) {
        const materialPipeline = materialCache.getPipeline(materialGeometries, forceSync);
        if (!materialPipeline) { continue; }

        materialPipeline.onBindMaterial?.(renderPass, materialGeometries.material);
        for (let geometryInstances of materialGeometries.geometryInstances.values()) {
          const pipeline = geometryInstances.mirrored ? materialPipeline.mirroredPipeline : materialPipeline.pipeline;

          // It's reasonable to expect that many variants of the same material will end up using the
          // same pipeline. Do some simple de-duping to avoid churn.
          // TODO: Do better sorting by pipeline?
          if (pipeline != lastPipeline) {
            pipeline!.use(renderPass);
            lastPipeline = pipeline;
          }

          geometryInstances.geometry.bindAndDraw(renderPass, geometryInstances.instanceCount, geometryInstances.indexOffset);
        }
      }
    }
  }

  #getMaterialPipelineCache(layout: GeometryLayout): MaterialPipelineCache {
    let cache = this.#layoutPipelineCache.get(layout.id);
    if (cache === undefined) {
      cache = new MaterialPipelineCache(layout, this.#attachmentLayout, this.#materialCallback);
      this.#layoutPipelineCache.set(layout.id, cache);
    }
    return cache;
  }
}