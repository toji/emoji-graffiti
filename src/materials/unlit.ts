import { Vec3, Vec3Like, Vec4, Vec4Like } from "gl-matrix";
import { WebGPURenderer } from "../renderer/webgpu-renderer.ts";
import { MaterialBase } from "./material-base.ts";


export interface UnlitMaterialDesc {
  label?: string;
  transparent?: boolean;
  doubleSided?: boolean;
  baseColorFactor?: Vec4Like;
  baseColorTexture?: GPUTexture;

  baseAlbedo?: Vec3Like;
  canDecal?: boolean;
}

export class UnlitMaterial extends MaterialBase implements UnlitMaterialDesc {
  static SharedComponent = true;

  uniformBuffer: GPUBuffer;
  materialBindGroup: GPUBindGroup;

  label?: string;
  transparent: boolean;
  doubleSided: boolean;
  baseColorFactor: Vec4;
  baseColorTexture?: GPUTexture;

  baseAlbedo: Vec3;
  canDecal: boolean;

  constructor(gpu: WebGPURenderer, desc?: UnlitMaterialDesc) {
    super();

    this.label = desc?.label;
    this.transparent = desc?.transparent ?? false;
    this.doubleSided = desc?.doubleSided ?? false;
    this.baseColorFactor = new Vec4(desc?.baseColorFactor ?? [1, 1, 1, 1]);
    this.baseColorTexture = desc?.baseColorTexture ?? gpu.whiteTexture;

    // These only apply to this specific demo
    this.baseAlbedo = new Vec3(desc?.baseAlbedo ?? [1, 1, 1]);
    this.canDecal = desc?.canDecal ?? false;

    this.uniformBuffer = gpu.device.createBuffer({
      label: 'Unlit Material',
      size: Vec4.BYTE_LENGTH * 2,
      usage: GPUBufferUsage.UNIFORM,
      mappedAtCreation: true,
    });

    this.materialBindGroup = gpu.device.createBindGroup({
      label: 'Unlit Material',
      layout: gpu.unlitPipelineFactory.materialBGL,
      entries: [{
        binding: 0,
        resource: this.uniformBuffer,
      }, {
        binding: 1,
        resource: this.baseColorTexture,
      }, {
        binding: 2,
        resource: gpu.defaultSampler,
      }]
    });

    const mapped = new Float32Array(this.uniformBuffer.getMappedRange());
    mapped.set(this.baseColorFactor, 0);
    mapped.set(this.baseAlbedo, 4);

    this.uniformBuffer.unmap();

    // Materials are immutable after creation.
    Object.freeze(this);
  }
}
