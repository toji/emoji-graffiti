import { Vec3, Vec3Like, Vec4, Vec4Like } from "gl-matrix";
import { WebGPURenderer } from "../renderer/webgpu-renderer.ts";
import { MaterialBase } from "./material-base.ts";

export interface PBRMaterialDesc {
  label?: string;
  transparent?: boolean;
  doubleSided?: boolean;
  baseColorFactor?: Vec4Like;
  baseColorTexture?: GPUTexture;
  normalTexture?: GPUTexture;
  metallicFactor?: number;
  roughnessFactor?: number;
  metallicRoughnessTexture?: GPUTexture;
  occlusionTexture?: GPUTexture;
  emissiveFactor?: Vec3Like;
  emissiveTexture?: GPUTexture;
}

export class PBRMaterial extends MaterialBase implements PBRMaterialDesc {
  static SharedComponent = true;

  uniformBuffer: GPUBuffer;
  materialBindGroup: GPUBindGroup;

  label?: string;
  transparent: boolean;
  doubleSided: boolean;
  baseColorFactor: Vec4;
  baseColorTexture: GPUTexture;
  normalTexture: GPUTexture;
  metallicFactor: number;
  roughnessFactor: number;
  metallicRoughnessTexture: GPUTexture;
  occlusionTexture: GPUTexture;
  emissiveFactor: Vec3;
  emissiveTexture: GPUTexture;

  constructor(gpu: WebGPURenderer, desc?: PBRMaterialDesc) {
    super();

    this.label = desc?.label;
    this.transparent = desc?.transparent ?? false;
    this.doubleSided = desc?.doubleSided ?? false;
    this.baseColorFactor = new Vec4(desc?.baseColorFactor ?? [1, 1, 1, 1]);
    this.baseColorTexture = desc?.baseColorTexture ?? gpu.whiteTexture;
    this.normalTexture = desc?.normalTexture ?? gpu.normalTexture;
    this.metallicFactor = desc?.metallicFactor ?? 0;
    this.roughnessFactor = desc?.roughnessFactor ?? 1;
    this.metallicRoughnessTexture = desc?.metallicRoughnessTexture ?? gpu.whiteTexture;
    this.occlusionTexture = desc?.occlusionTexture ?? gpu.whiteTexture;;
    this.emissiveFactor = new Vec3(desc?.emissiveFactor ?? [1, 1, 1]);
    this.emissiveTexture = desc?.emissiveTexture ?? gpu.blackTexture;

    this.uniformBuffer = gpu.device.createBuffer({
      label: 'PBR Material',
      size: Vec4.BYTE_LENGTH * 2,
      usage: GPUBufferUsage.UNIFORM,
      mappedAtCreation: true,
    });

    this.materialBindGroup = gpu.device.createBindGroup({
      label: 'Unlit Material',
      layout: gpu.pbrPipelineFactory.materialBGL,
      entries: [{
        binding: 0,
        resource: this.uniformBuffer,
      }, {
        binding: 1,
        resource: gpu.defaultSampler,
      }, {
        binding: 2,
        resource: this.baseColorTexture,
      }, {
        binding: 3,
        resource: this.normalTexture,
      }, {
        binding: 4,
        resource: this.metallicRoughnessTexture,
      }, {
        binding: 5,
        resource: this.occlusionTexture,
      }, {
        binding: 6,
        resource: this.emissiveTexture,
      }]
    });

    const mapped = new Float32Array(this.uniformBuffer.getMappedRange());
    mapped.set(this.baseColorFactor, 0);
    mapped[4] = this.metallicFactor;
    mapped[5] = this.roughnessFactor;
    mapped.set(this.emissiveFactor, 8);

    this.uniformBuffer.unmap();

    // Materials are immutable after creation.
    Object.freeze(this);
  }
}
