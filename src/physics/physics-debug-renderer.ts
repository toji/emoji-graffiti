import RAPIER from '@dimforge/rapier3d-compat';
import { Actor } from "../core/actor.ts";
import { Stage, TickData } from "../core/stage.ts";
import { WebGPURenderer } from '../renderer/webgpu-renderer.ts';
import { Geometry } from '../geometry/geometry.ts';
import { UnlitMaterial } from '../materials/unlit.ts';
import { StagePhysics } from './stage-physics.ts';

export class PhysicsDebugRenderer {
  gpu: WebGPURenderer;
  debugRenderActor: Actor = new Actor();
  debugRenderGeometry?: Geometry;

  constructor(gpu: WebGPURenderer) {
    this.gpu = gpu;
    this.debugRenderActor.label = "PhysicsDebugRenderer Proxy"
    this.debugRenderActor.add(new UnlitMaterial(gpu, { depthTest: false }));
  }

  addToStage(stage: Stage, actor: Actor) {
    stage.attachChild(this.debugRenderActor);
  }

  removeFromStage(stage: Stage, actor: Actor) {
    stage.removeChild(this.debugRenderActor);
  }

  //static TickOrder = 1;
  onTick(tickData: TickData, actor: Actor) {
    let stagePhysics = actor.stage?.get(StagePhysics);
    if (!stagePhysics) { return; }

    const debugBuffers = stagePhysics.world.debugRender();
    this.debugRenderGeometry = new Geometry(this.gpu, {
      label: 'PhysicsDebugRenderer Geometry',
      position: debugBuffers.vertices,
      color: debugBuffers.colors,
      topology: 'line-list'
    });
    this.debugRenderActor.add(this.debugRenderGeometry);
  }
}