import RAPIER from '@dimforge/rapier3d-compat';
import { Stage, TickData } from '../core/stage.ts';
import { Actor } from '../core/actor.ts';
import { StagePhysics } from './stage-physics.ts';

export class CharacterController {
  #controller?: RAPIER.KinematicCharacterController;

  constructor(private colliderDescs: RAPIER.ColliderDesc[]) {
  }

  #ensureController(actor: Actor): RAPIER.KinematicCharacterController | undefined {
    if (this.#controller) { return this.#controller; }

    if (!actor.stage) { return undefined; }

    const stagePhysics = actor.stage?.get(StagePhysics);
    if (!stagePhysics) { return undefined; }

    const translation = actor.transform.translation;
    const rotation = actor.transform.rotation;

    this.#controller = stagePhysics.world.createCharacterController(0.2);
  }

  clone() {
    return new CharacterController(this.colliderDescs);
  }

  addToStage(stage: Stage, actor: Actor) {
    this.#ensureController(actor);
  }

  removeFromStage(stage: Stage, actor: Actor) {
    if (!this.#controller) { return; }

    let stagePhysics = stage.get(StagePhysics);
    if (!stagePhysics) { return; }

    stagePhysics.world.removeCharacterController(this.#controller);
    this.#controller = undefined;
  }

  // TODO: Update the collider positions with the actor?
}