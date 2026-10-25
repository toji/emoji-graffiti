import { MaterialBase } from "../materials/material-base.ts";
import { AttachmentLayout } from "./attachment-layout.ts";
import { GeometryInstances, InstanceManager } from "./instance-manager.ts";

export type MaterialFilter = (material: MaterialBase) => { pipelineFactory: any, filter: GeometryFilter, onBindMaterial?: MaterialBindCallback } | undefined;
export type MaterialBindCallback = (renderPass: GPURenderPassEncoder, material: MaterialBase) => void;
export type GeometryFilter = (geometryInstances: GeometryInstances) => any | undefined;

export class GeometryInstancePass {
  attachmentLayout: AttachmentLayout;
  materialFilter: MaterialFilter;

  constructor(attachmentLayout: AttachmentLayout, materialFilter: MaterialFilter) {
    this.attachmentLayout = attachmentLayout;
    this.materialFilter = materialFilter;
  }

  drawGeometryInstances(renderPass: GPURenderPassEncoder, instanceManager: InstanceManager) {
    for (let materialGeometries of instanceManager.materials.values()) {
      // Filter by material?
      const renderMaterial = this.materialFilter(materialGeometries.material);
      if (renderMaterial) {
        const { pipelineFactory, filter, onBindMaterial } = renderMaterial;
        if (onBindMaterial) {
          onBindMaterial(renderPass, materialGeometries.material);
        }
        for (let geometryInstances of materialGeometries.geometryInstances.values()) {
          const pipelineArgs = filter(geometryInstances);
          if (pipelineArgs) {
            const pipeline = pipelineFactory.getPipeline(geometryInstances.geometry.layout, this.attachmentLayout, pipelineArgs);
            pipeline.use(renderPass);
            geometryInstances.geometry.bindAndDraw(renderPass, geometryInstances.instanceCount, geometryInstances.indexOffset);
          }
        }
      }
    }
  }
}