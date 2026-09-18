import RAPIER from '@dimforge/rapier3d-compat';
import { Stage, TickData } from '../core/stage.ts';
import { Actor } from '../core/actor.ts';
import { StagePhysics } from './stage-physics.ts';

export class StaticCollider {
  #colliders?: RAPIER.Collider[];

  constructor(private colliderDescs: RAPIER.ColliderDesc[]) {
  }

  #ensureColliders(actor: Actor): RAPIER.Collider[] | undefined {
    if (this.#colliders) { return this.#colliders; }

    if (!actor.stage) { return undefined; }

    const stagePhysics = actor.stage?.get(StagePhysics);
    if (!stagePhysics) { return undefined; }

    // TODO: This should be world transform, but the rotation decompose in the
    // transform is screwing up for some scaling values.
    const translation = actor.transform.translation;
    const rotation = actor.transform.rotation;

    this.#colliders = [];
    for (const colliderDesc of this.colliderDescs) {
      const collider = stagePhysics.world.createCollider(colliderDesc);
      collider.setRotation(rotation);
      collider.setTranslation(translation);
      this.#colliders.push(collider);
    }
  }

  get collider() {
    return this.#colliders?.[0];
  }

  clone() {
    return new StaticCollider(this.colliderDescs);
  }

  addToStage(stage: Stage, actor: Actor) {
    this.#ensureColliders(actor);
  }

  removeFromStage(stage: Stage, actor: Actor) {
    if (!this.#colliders) { return; }

    let stagePhysics = stage.get(StagePhysics);
    if (!stagePhysics) { return; }
    for (const collider of this.#colliders) {
      stagePhysics.world.removeCollider(collider, false);
    }

    this.#colliders = undefined;
  }

  // TODO: Update the collider positions with the actor?
}