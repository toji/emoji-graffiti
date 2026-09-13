import { GlTf, Node } from './gltf-interfaces.ts';
import { GltfState } from './gltf-state.ts';
import { WebGPURenderer } from '../../renderer/webgpu-renderer.ts';
import { Actor } from '../../core/actor.ts';
import { Mat4Like, Vec3, Vec3Like, Vec4Like } from 'gl-matrix';
import { StaticCollider } from '../../physics/static-collider.ts';
import RAPIER from '@dimforge/rapier3d-compat';
import { Geometry } from '../../geometry/geometry.ts';
import { BoxGeometry } from '../../geometry/descriptors/box.ts';
import { PBRMaterial } from '../../materials/pbr.ts';

const GLB_MAGIC = 0x46546C67; // ASCII for 'glTF'
const CHUNK_TYPE = {
  JSON: 0x4E4F534A,
  BIN: 0x004E4942,
};

export class GltfLoader {
  gpu: WebGPURenderer;

  constructor(gpu: WebGPURenderer) {
    this.gpu = gpu;
  }

  async loadFromUrl(url: string, userOptions: any = {}): Promise<Actor> {
    const state = new GltfState(this.gpu, userOptions, url);

    let extension = state.options.extension;
    if (extension === undefined) {
      const i = state.url.lastIndexOf('.');
      extension = (i !== -1) ? state.url.substring(i+1) : undefined;
    }

    switch (extension) {
      case 'gltf': {
        const response = await fetch(url);
        state.stats.fetchTime = performance.now() - state.stats.startTime;
        state.stats.fetchCount = 1;
        return this.loadFromJson(await response.json(), state);
      }
      case 'glb': {
        const response = await fetch(url);
        state.stats.fetchTime = performance.now() - state.stats.startTime;
        state.stats.fetchCount = 1;
        return this.loadFromBinary(await response.arrayBuffer(), state);
      }
      default:
        throw new Error(`Unrecognized file extension: ${extension}`);
    }
  }

  async loadFromBinary(arrayBuffer: ArrayBuffer, userOptions: any|GltfState = {}): Promise<Actor> {
    let state: GltfState;
    if (userOptions instanceof GltfState) {
      state = userOptions;
    } else {
      state = new GltfState(this.gpu, userOptions);
    }

    const headerView = new DataView(arrayBuffer, 0, 12);
    const magic = headerView.getUint32(0, true);
    const version = headerView.getUint32(4, true);
    const length = headerView.getUint32(8, true);

    if (magic != GLB_MAGIC) {
      throw new Error(`Invalid magic value (${magic}) in binary header.`);
    }

    if (version != 2) {
      throw new Error(`Incompatible version (${version}) in binary header. Only glTF 2.0 files are supported.`);
    }

    let chunks: ArrayBuffer[] = [];
    let chunkOffset = 12;
    while (chunkOffset < length) {
      const chunkHeaderView = new DataView(arrayBuffer, chunkOffset, 8);
      const chunkLength = chunkHeaderView.getUint32(0, true);
      const chunkType = chunkHeaderView.getUint32(4, true);
      chunks[chunkType] = arrayBuffer.slice(chunkOffset + 8, chunkOffset + 8 + chunkLength);
      chunkOffset += chunkLength + 8;
    }

    if (!chunks[CHUNK_TYPE.JSON]) {
      throw new Error('File contained no json chunk.');
    }

    const decoder = new TextDecoder('utf-8');
    const jsonString = decoder.decode(chunks[CHUNK_TYPE.JSON]);

    const gltf: GlTf = JSON.parse(jsonString);
    gltf.buffers = [{
      byteLength: chunks[CHUNK_TYPE.BIN].byteLength,
    }];

    return this.loadFromJson(gltf, state, chunks[CHUNK_TYPE.BIN]);
  }

  async loadFromJson(gltf: GlTf, userOptions: any|GltfState = {}, binaryChunk?: ArrayBuffer): Promise<Actor> {
    let state: GltfState;
    if (userOptions instanceof GltfState) {
      state = userOptions;
    } else {
      state = new GltfState(this.gpu, userOptions);
    }

    state.init(gltf, binaryChunk);

    if (!gltf.scenes) {
      throw new Error(`Gltf ${state.url} does not have any scenes`);
    }

    // Build out the scene graph
    const actors: Actor[] = [];
    const sceneIndex = gltf.scene ?? 0;
    const scene = gltf.scenes[sceneIndex];
    for (const nodeIndex of scene.nodes ?? []) {
      state.scene.attachChild(await this.buildNodeActor(state, nodeIndex, actors));
    }

    // Build physics nodes. Done after the scene graph above so that the world transforms can be
    // fully calculated.
    for (const nodeIndex of gltf.nodes?.keys() ?? []) {
      this.buildNodePhysics(state, nodeIndex, actors);
    }

    return state.scene;
  }

  async buildNodeActor(state: GltfState, nodeIndex: number, actors: Actor[]): Promise<Actor> {
    const node: Node = state.gltf.nodes![nodeIndex];

    // Create a new Actor
    const actor = new Actor();
    actors[nodeIndex] = actor;

    // Attach components
    if (node.mesh !== undefined) {
      const mesh = await state.getMesh(node.mesh);

      // TODO: Temporary hack to not load meshse for colliders
      if (mesh !== undefined && node.extensions?.KHR_physics_rigid_bodies === undefined) {
        if (mesh.primitives.length == 1) {
          actor.add(mesh.primitives[0].geometry);
          actor.add(mesh.primitives[0].material);
        } else {
          // If there's more than one primitive we need to break it up into child
          // actors, because each actor can only have one geometry.
          for (const primitive of mesh.primitives) {
            actor.attachChild(new Actor(primitive.geometry, primitive.material));
          }
        }
      }
    }

    // Set the actor transform
    if (node.matrix) {
      actor.transform.matrix = node.matrix as Mat4Like;
    } else {
      actor.transform.rotation = node.rotation as Vec4Like;
      actor.transform.translation = node.translation as Vec3Like;
      actor.transform.scale = node.scale as Vec3Like;
    }

    // Populate any child nodes
    for (const childIndex of node.children ?? []) {
      actor.attachChild(await this.buildNodeActor(state, childIndex, actors));
    }

    return actor;
  }

  buildNodePhysics(state: GltfState, nodeIndex: number, actors: Actor[]) {
    const node: Node = state.gltf.nodes![nodeIndex];
    const actor = actors[nodeIndex];
    if (!actor) { return; }

    if (node.extensions?.KHR_physics_rigid_bodies) {
      const collider = node.extensions.KHR_physics_rigid_bodies.collider;
      if (collider) {
        let rapierCollider: RAPIER.ColliderDesc | undefined;
        const shapeIndex = collider.geometry?.shape;

        // TODO: Handle more collider geometries.
        if (shapeIndex !== undefined) {
          const shape = state.gltf.extensions!.KHR_implicit_shapes?.shapes[shapeIndex];
          if (shape?.box) {
            const size = new Vec3(shape.box.size ?? [1, 1, 1]);
            Vec3.mul(size, size, actor.worldTransform.scale);
            rapierCollider = RAPIER.ColliderDesc.cuboid(size[0]/2, size[1]/2, size[2]/2);
          }

          if (rapierCollider) {
            actor.add(new StaticCollider([rapierCollider]));
          }
        }
      }
    }
  }
}
