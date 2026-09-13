import { Accessor, GlTf, Material, MaterialNormalTextureInfo, Mesh, MeshPrimitive, TextureInfo } from './gltf-interfaces.ts';
import { WebGPURenderer } from '../../renderer/webgpu-renderer.ts';
import { Actor } from '../../core/actor.ts';
import { WebTextureOptions } from '../texture/texture-loader-base.ts';
import { AttributeDescriptor, Geometry, GeometryDescriptor } from '../../geometry/geometry.ts';
import { MaterialBase } from '../../materials/material-base.ts';
import { UnlitMaterial } from '../../materials/unlit.ts';
import { Vec3Like, Vec4Like } from 'gl-matrix';
import { PBRMaterial } from '../../materials/pbr.ts';

// To make it easier to reference the WebGL enums that glTF uses.
const GL = WebGLRenderingContext;

const absUriRegEx = new RegExp(`^${window.location.protocol}`, 'i');
const dataUriRegEx = /^data:/;

function isDataUri(uri: string) {
  return !!uri.match(dataUriRegEx);
}

function resolveUri(uri: string, baseUrl: string) {
  if (!!uri.match(absUriRegEx) || !!uri.match(dataUriRegEx)) {
    return uri;
  }
  return baseUrl + uri;
}

const DEFAULT_TRANSLATION = [0, 0, 0];
const DEFAULT_ROTATION = [0, 0, 0, 1];
const DEFAULT_SCALE = [1, 1, 1];

function componentCountForType(type: string) {
  switch (type) {
    case 'SCALAR': return 1;
    case 'VEC2': return 2;
    case 'VEC3': return 3;
    case 'VEC4': return 4;
    case 'MAT2': return 4;
    case 'MAT3': return 9;
    case 'MAT4': return 16;
    default: return 0;
  }
}

function byteSizeForComponentType(componentType: GLenum) {
  switch (componentType) {
    case GL.BYTE: return 1;
    case GL.UNSIGNED_BYTE: return 1;
    case GL.SHORT: return 2;
    case GL.UNSIGNED_SHORT: return 2;
    case GL.UNSIGNED_INT: return 4;
    case GL.FLOAT: return 4;
    default: return 0;
  }
}

function accessorPackedByeStride(accessor: Accessor) {
  return byteSizeForComponentType(accessor.componentType) * componentCountForType(accessor.type);
}

interface GltfLoadStats {
  startTime: number,
  fetchTime: number,
  fetchCount: number,
  transforms: object
}

interface WebGPUMeshPrimitive {
  geometry: Geometry,
  material: MaterialBase
}

interface WebGPUMesh {
  primitives: WebGPUMeshPrimitive[]
}

interface ImplicitShape {
  type: string;
}

export class GltfState {
  gpu: WebGPURenderer;
  gltf!: GlTf;
  url: string;
  baseUrl: string;
  filename: string;
  options: any;
  stats: GltfLoadStats;

  scene: Actor = new Actor();

  #bufferViewByteArrays: Promise<Uint8Array<ArrayBuffer>>[] = [];
  #imageTextures: Promise<GPUTexture>[] = [];
  #samplers: GPUSampler[] = [];
  #materials: Promise<MaterialBase>[] = [];
  #meshes: Promise<WebGPUMesh>[] = [];

  constructor(gpu: WebGPURenderer, userOptions: any, url?: string) {
    this.gpu = gpu;

    this.stats = {
      startTime: performance.now(),
      fetchTime: 0,
      fetchCount: 0,
      transforms: {}
    };

    this.options = structuredClone(userOptions);

    this.url = url ?? userOptions.url;
    if (this.url === undefined) {
      throw new Error(`A url must be specified.`);
    }
    const filenameIdx = this.url.lastIndexOf('/');
    this.filename = this.url.substring(filenameIdx+1);

    // Populate options defaults
    this.baseUrl = userOptions.baseUrl;
    if (this.baseUrl === undefined) {
      if (filenameIdx === -1) {
        throw new Error(`A baseUrl must be specified or derived from the url.`);
      }
      this.baseUrl = this.url.substring(0, filenameIdx + 1);
    }
  }

  init(gltf: GlTf, binaryChunk?: ArrayBuffer) {
    this.gltf = gltf;

    const asset = gltf.asset;
    if (!asset) {
      throw new Error('Missing asset description.');
    }

    if (asset.minVersion != '2.0' && asset.version != '2.0') {
      throw new Error('Incompatible asset version.');
    }

    this.#setDefaults();
    this.#loadBuffers(binaryChunk);
    this.#loadImages();
    this.#loadSamplers();
    this.#loadMaterials();
    this.#loadMeshes();
  }

  getBufferViewByteArray(index: number): Promise<Uint8Array<ArrayBuffer>> {
    return this.#bufferViewByteArrays[index];
  }

  getImageTexture(index: number): Promise<GPUTexture> {
    return this.#imageTextures[index];
  }

  getSampler(index: number): GPUSampler {
    return this.#samplers[index];
  }

  getMaterial(index: number): Promise<MaterialBase> {
    return this.#materials[index];
  }

  getMesh(index: number): Promise<WebGPUMesh> {
    return this.#meshes[index];
  }

  setExtras(obj: any, extras: any) {
    if (obj.extras === undefined) {
      obj.extras = extras;
    } else {
      Object.assign(obj.extras, extras);
    }
  }

  // Primes the gltf structure with defaults from the spec where data isn't specified
  #setDefaults() {
    const gltf = this.gltf;

    // Add empty arrays for some data types if they're missing to make parsing easier.
    gltf.extensionsRequired = gltf.extensionsRequired ?? [];
    gltf.extensionsUsed = gltf.extensionsUsed ?? [];
    gltf.samplers = gltf.samplers ?? [];
    gltf.images = gltf.images ?? [];
    gltf.textures = gltf.textures ?? [];
    gltf.materials = gltf.materials ?? []

    if (gltf.scenes) {
      gltf.scene = gltf.scene ?? 0;
    }

    // Accessor defaults
    for (const accessor of gltf.accessors ?? []) {
      accessor.byteOffset = accessor.byteOffset ?? 0;
      accessor.normalized = accessor.normalized ?? false;

      this.setExtras(accessor, {
        componentCount: componentCountForType(accessor.type),
        packedByteStride: accessorPackedByeStride(accessor),
      });
    }

    // Texture defaults
    let defaultSampler = -1;
    for (const texture of gltf.textures ?? []) {
      // If any textures use a default sampler, point it at an explicit one to make parsing easier.
      if (texture.sampler === undefined) {
        if (defaultSampler === -1) {
          defaultSampler = (gltf.samplers).length;
          gltf.samplers.push({ name: 'Default Sampler' });
        }
        texture.sampler = defaultSampler;
      }
    }

    // Sampler defaults
    for (const sampler of gltf.samplers ?? []) {
      sampler.wrapS = sampler.wrapS ?? GL.REPEAT;
      sampler.wrapT = sampler.wrapT ?? GL.REPEAT;
      sampler.magFilter = sampler.magFilter ?? GL.LINEAR;
      sampler.minFilter = sampler.minFilter ?? GL.LINEAR_MIPMAP_LINEAR;
    }

    // Mesh defaults
    let defaultMaterial = -1;
    if (gltf.meshes) {
      for (const index in gltf.meshes) {
        const mesh = gltf.meshes[index];

        // Primitives
        for (const primitiveIndex in mesh.primitives) {
          const primitive = mesh.primitives[primitiveIndex];

          // Set the target for each bufferView that's referenced by a primitive attribute.
          for (const accessorIndex of Object.values(primitive.attributes)) {
            const accessor = gltf.accessors![accessorIndex];
            this.setExtras(accessor, { target: GL.ARRAY_BUFFER });
          }

          // Set the target for each bufferView that's referenced by primitive indices.
          if ('indices' in primitive) {
            const accessor = gltf.accessors![primitive.indices!];
            this.setExtras(accessor, { target: GL.ELEMENT_ARRAY_BUFFER });
          }

          primitive.mode = primitive.mode ?? GL.TRIANGLES;

          // Inject a default material if needed
          if (primitive.material === undefined) {
            if (defaultMaterial < 0) {
              defaultMaterial = gltf.materials.length;
              gltf.materials.push({ name: 'Default Material' });
            }
            primitive.material = defaultMaterial;
          }
        }
      }
    }

    // Material defaults
    for (const material of gltf.materials) {
      material.emissiveFactor = material.emissiveFactor ?? [0, 0, 0];
      material.alphaMode = material.alphaMode ?? 'OPAQUE';
      material.alphaCutoff = material.alphaCutoff ?? 0.5;
      material.doubleSided = material.doubleSided ?? false;

      const pbr = material.pbrMetallicRoughness;
      if (pbr) {
        pbr.baseColorFactor = pbr.baseColorFactor ?? [1, 1, 1, 1];
        pbr.metallicFactor = pbr.metallicFactor ?? 1;
        pbr.roughnessFactor = pbr.roughnessFactor ?? 1;

        if (pbr.normalTexture) {
          pbr.normalTexture.scale = pbr.normalTexture.scale ?? 1;
        }

        if (pbr.occlusionTexture) {
          pbr.occlusionTexture.strength = pbr.occlusionTexture.strength ?? 1;
        }
      }
    }

    // Node defaults
    for (const node of gltf.nodes ?? []) {
      if (!node.matrix) {
        node.rotation = node.rotation ?? DEFAULT_ROTATION;
        node.scale = node.scale ?? DEFAULT_SCALE;
        node.translation = node.translation ?? DEFAULT_TRANSLATION;
      }
    }

    // Not from the spec, but useful to have.
    if (this.gltf.extras === undefined) {
      this.gltf.extras = {};
    }
    this.gltf.extras.url = this.url;
  }

  #loadBuffers(binaryChunk?: ArrayBuffer) {
    const gltf = this.gltf;

    const buffers: Promise<ArrayBuffer>[] = [];
    if (binaryChunk) {
      buffers[0] = Promise.resolve(binaryChunk);
    } else {
      // Load all buffers with a uri
      if (gltf.buffers) {
        for (let bufferIndex = 0; bufferIndex < gltf.buffers.length; bufferIndex++) {
          const buffer = gltf.buffers[bufferIndex];
          if (!buffer.uri) { continue; }

          const uri = resolveUri(buffer.uri, this.baseUrl);
          buffers[bufferIndex] = fetch(uri).then((response) => {
            return response.arrayBuffer();
          });
        }
      }
    }

    if (gltf.bufferViews) {
      for (let bufferViewIndex = 0; bufferViewIndex < gltf.bufferViews.length; bufferViewIndex++) {
        const bufferView = gltf.bufferViews[bufferViewIndex];
        this.#bufferViewByteArrays[bufferViewIndex] = buffers[bufferView.buffer].then((arrayBuffer: ArrayBuffer) => {
          // If the byteLength is undefined, compute it from the arrayBuffer once it resolves.
          if (bufferView.byteLength === undefined) {
            bufferView.byteLength = arrayBuffer.byteLength - bufferView.byteOffset!;
          }

          return new Uint8Array(arrayBuffer, bufferView.byteOffset, bufferView.byteLength);
        });
      }
    }
  }

  // Loads all images as WebGPU textures
  #loadImages() {
    const gltf = this.gltf;

    if (!gltf.images) { return; }

    // Associates every image with a list of the material slots they are used in,
    // which helps with things like identifying which textures need to be uploaded
    // as sRGB.
    const annotateImages = () => {
      const gltf = this.gltf;
      const SRGB_TEXTURE_SLOTS = ['baseColorTexture', 'diffuseTexture', 'emissiveTexture'];

      if (!gltf.materials?.length) { return; }

      const materialsSlotsByImage = new Map();

      const markSource = (source: number | undefined, key: string) => {
        if (source === undefined) { return; }
        const image = gltf.images![source];
        let materialSlots = materialsSlotsByImage.get(image);
        if (!materialSlots) {
          materialSlots = [key];
          materialsSlotsByImage.set(image, materialSlots);
        } else {
          materialSlots.push(key);
        }

        // Indicate if the texture should be treated as sRGB
        if (SRGB_TEXTURE_SLOTS.indexOf(key) !== -1) {
          this.setExtras(image, { sRgb: true });
        }
      }

      const annotateMaterial = (materialProperties: Material) => {
        if (!materialProperties) { return; }

        for (const [key, value] of Object.entries(materialProperties)) {
          if (key.endsWith('Texture')) {
            //@ts-ignore
            const texture = gltf.textures[value.index];

            // If an image is associated with a material texture slot, add it to
            // the list of slots for this image.
            markSource(texture.source, key);
            markSource(texture.extensions?.KHR_texture_basisu?.source, key);
          } else if (key !== 'extras' && typeof value === 'object') {
            // Recurse
            annotateMaterial(value);
          }
        }
      }

      // Check every material in the glTF file.
      for (const material of gltf.materials) {
        annotateMaterial(material);
      }

      for (const image of gltf.images!) {
        const materialSlots = materialsSlotsByImage.get(image) ?? [];
        this.setExtras(image, { materialSlots });
      }
    }

    const loadImage = async(index: number): Promise<GPUTexture> => {
      const image = gltf.images![index];

      let textureOptions: WebTextureOptions = { colorSpace: image.extras.sRgb ? 'sRGB' : 'linear'};
      let blob: Blob;
      if (image.uri) {
        const uri = resolveUri(image.uri, this.baseUrl);
        if (!isDataUri(uri)) {
          this.#imageTextures[index] = this.gpu.textureLoader.fromUrl(uri, textureOptions);
        }

        // Data URIs are loaded as blobs
        const response = await fetch(uri);
        blob = await response.blob();
      } else if (image.bufferView !== undefined) {
        // For images loaded from a buffer view, load them from a byte array initially but cache
        // them as separate image blobs and remove that portion of the buffer from the cache.
        // This appears to speed up loading of images significantly!
        const byteArray: BufferSource = await this.getBufferViewByteArray(image.bufferView);
        blob = new Blob([byteArray], {type: image.mimeType});
      } else {
        console.warn(`Gltf Image[${index}] did not have a uri or buffer view. Returning default texture.`);
        return this.gpu.textureLoader.fromColor(1, 0, 1, 1); // Magenta default color
      }

      return this.gpu.textureLoader.fromBlob(blob, textureOptions);
    }

    annotateImages();

    for (let i = 0; i < gltf.images.length; ++i) {
      this.#imageTextures[i] = loadImage(i);
    }
  }

  #loadSamplers() {
    const gltf = this.gltf;

    if (!gltf.samplers) { return; }

    function wrapToAddressMode(wrap?: GLenum): GPUAddressMode {
      switch (wrap) {
        case GL.CLAMP_TO_EDGE: return 'clamp-to-edge';
        case GL.MIRRORED_REPEAT: return 'mirror-repeat';
        default: return 'repeat';
      }
    }

    for (const [index, sampler] of gltf.samplers.entries()) {
      const descriptor: GPUSamplerDescriptor = {
        addressModeU: wrapToAddressMode(sampler.wrapS),
        addressModeV: wrapToAddressMode(sampler.wrapT),
      };

      switch (sampler.magFilter) {
        case GL.NEAREST: break;
        default: descriptor.magFilter = 'linear'; break;
      }

      switch (sampler.minFilter) {
        case GL.NEAREST: break;
        case GL.LINEAR:
        case GL.LINEAR_MIPMAP_NEAREST:
          descriptor.minFilter = 'linear';
          break;
        case GL.NEAREST_MIPMAP_LINEAR:
          descriptor.mipmapFilter = 'linear';
          break;
        default:
          descriptor.minFilter = 'linear';
          descriptor.mipmapFilter = 'linear';
          break;
      }

      this.#samplers[index] = this.gpu.device.createSampler(descriptor);
    }
  }

  #loadMaterials() {
    const gltf = this.gltf;

    if (!gltf.materials) { return; }

    const buildMaterial = async (material: Material): Promise<MaterialBase> => {

      const getTexture = async (textureInfo: TextureInfo | MaterialNormalTextureInfo | undefined): Promise<GPUTexture | undefined> => {
        if (textureInfo === undefined) { return undefined; }

        const texture = gltf.textures![textureInfo.index];

        let imageIndex = texture.source;
        if (texture.extensions?.KHR_texture_basisu) {
          imageIndex = texture.extensions.KHR_texture_basisu.source;
        }

        return this.getImageTexture(imageIndex!);
      }

      // TODO: Handle samplers, handle transparency, etc.

      if (material.extensions?.KHR_materials_unlit !== undefined) {
        return new UnlitMaterial(this.gpu, {
          label: material.name,
          doubleSided: material.doubleSided,
          baseColorFactor: material.pbrMetallicRoughness?.baseColorFactor as Vec4Like,
          baseColorTexture: await getTexture(material.pbrMetallicRoughness?.baseColorTexture),

          baseAlbedo: material.extras?.baseColor,
          canDecal: material.extras?.canDecal,
        });
      }

      return new PBRMaterial(this.gpu, {
        label: material.name,
        doubleSided: material.doubleSided,
        baseColorFactor: material.pbrMetallicRoughness?.baseColorFactor as Vec4Like,
        baseColorTexture: await getTexture(material.pbrMetallicRoughness?.baseColorTexture),
        normalTexture: await getTexture(material.normalTexture),
        metallicFactor: material.pbrMetallicRoughness?.metallicFactor,
        roughnessFactor: material.pbrMetallicRoughness?.roughnessFactor,
        metallicRoughnessTexture: await getTexture(material.pbrMetallicRoughness?.metallicRoughnessTexture),
        emissiveFactor: material.emissiveFactor as Vec3Like,
        emissiveTexture: await getTexture(material.emissiveTexture),
        occlusionTexture: await getTexture(material.occlusionTexture),
      });
    }

    for (const [index, material] of gltf.materials.entries()) {
      this.#materials[index] = buildMaterial(material);
    }
  }

  #loadMeshes() {
    const gltf = this.gltf;

    if (!gltf.meshes) { return; }

    function gpuFormatForAccessor(accessor: Accessor): GPUVertexFormat {
      const norm = accessor.normalized ? 'norm' : 'int';
      const count = accessor.extras.componentCount;
      let x = count > 1 ? `x${count}` : '';

      // TODO: Dumb workaround to fix meshopt_compression support;
      // I don't think this is always going to be correct.
      /*switch (accessor.componentType) {
        case GL.BYTE:
        case GL.UNSIGNED_BYTE:
        case GL.SHORT:
        case GL.UNSIGNED_SHORT:
          if (count == 1) {
            x = 'x2';
          } else if (count == 3) {
            x = 'x4';
          }
          break;
      }*/

      switch (accessor.componentType) {
        case GL.BYTE: return `s${norm}8${x}` as GPUVertexFormat;
        case GL.UNSIGNED_BYTE: return `u${norm}8${x}` as GPUVertexFormat;
        case GL.SHORT: return `s${norm}16${x}` as GPUVertexFormat;
        case GL.UNSIGNED_SHORT: return `u${norm}16${x}` as GPUVertexFormat;
        case GL.UNSIGNED_INT: return `u${norm}32${x}` as GPUVertexFormat;
        case GL.FLOAT: return `float32${x}` as GPUVertexFormat;
        default: throw new Error(`Unsupported vertex format: ${accessor.componentType}`);
      }
    }

    function gpuPrimitiveTopologyForMode(mode?: GLenum): GPUPrimitiveTopology {
      switch (mode) {
        case undefined:
        case GL.TRIANGLES: return 'triangle-list';
        case GL.TRIANGLE_STRIP: return 'triangle-strip';
        case GL.LINES: return 'line-list';
        case GL.LINE_STRIP: return 'line-strip';
        case GL.POINTS: return 'point-list';
        default: throw new Error(`Unsupported Primitive Topology: ${mode}`);
      }
    }

    const buildGeometryDescriptor = async (primitive: MeshPrimitive): Promise<GeometryDescriptor> => {
      const descriptor: GeometryDescriptor = {
        topology: gpuPrimitiveTopologyForMode(primitive.mode),
      };

      for (const [attribName, accessorIndex] of Object.entries(primitive.attributes)) {
        const accessor = gltf.accessors![accessorIndex];
        const bufferView = gltf.bufferViews![accessor.bufferView!];

        const attributeDescriptor: AttributeDescriptor = {
          values: await this.getBufferViewByteArray(accessor.bufferView!),
          offset: accessor.byteOffset,
          stride: bufferView.byteStride || accessor.extras.packedByteStride,
          format: gpuFormatForAccessor(accessor)
        };

        switch(attribName) {
          case 'POSITION': descriptor.position = attributeDescriptor; break;
          case 'NORMAL': descriptor.normal = attributeDescriptor; break;
          case 'TANGENT': descriptor.tangent = attributeDescriptor; break;
          case 'TEXCOORD_0': descriptor.texcoord0 = attributeDescriptor; break;
          case 'TEXCOORD_1': descriptor.texcoord1 = attributeDescriptor; break;
          case 'COLOR_0': descriptor.color = attributeDescriptor; break;
          case 'JOINTS_0': descriptor.joints = attributeDescriptor; break;
          case 'WEIGHTS_0': descriptor.weights = attributeDescriptor; break;
          default:
            // Unsupported attribute.
            continue;
        }

        descriptor.drawCount = accessor.count;
      }

      if (primitive.indices !== undefined) {
        const accessor = gltf.accessors![primitive.indices];

        const indexBytes = await this.getBufferViewByteArray(accessor.bufferView!);
        const byteOffset = (accessor.byteOffset ?? 0) + indexBytes.byteOffset;
        let indexCount = accessor.count;
        switch (accessor.componentType) {
          case GL.UNSIGNED_SHORT:
            indexCount = Math.min(indexBytes.byteLength / 2, indexCount);
            descriptor.indices = new Uint16Array(indexBytes.buffer, byteOffset, indexCount);
            break;
          case GL.UNSIGNED_INT:
            indexCount = Math.min(indexBytes.byteLength / 4, indexCount);
            descriptor.indices = new Uint32Array(indexBytes.buffer, byteOffset, indexCount);
            break;
          default:
            throw new Error(`Unsupported index format ${accessor.componentType}`);
        }

        descriptor.drawCount = indexCount;
      }

      return descriptor;
    }

    const buildMesh = async (mesh: Mesh): Promise<WebGPUMesh> => {
      const descriptorPromises: Promise<GeometryDescriptor>[] = [];
      const materialPromises: Promise<MaterialBase>[] = [];
      for (const primitive of mesh.primitives) {
        descriptorPromises.push(buildGeometryDescriptor(primitive));
        materialPromises.push(this.getMaterial(primitive.material!));
      }

      const geometries = Geometry.CreateBatch(this.gpu.device, await Promise.all(descriptorPromises));
      const materials = await Promise.all(materialPromises);

      return {
        primitives: geometries.map((geometry, index): WebGPUMeshPrimitive => {
          const material = materials[index];
          return {geometry, material};
        })
      };
    }

    for (const mesh of gltf.meshes) {
      this.#meshes.push(buildMesh(mesh));
    }
  }
}
