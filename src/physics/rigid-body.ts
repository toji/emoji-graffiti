import RAPIER from '@dimforge/rapier3d-compat';
import { Stage, TickData } from '../core/stage.ts';
import { Actor } from '../core/actor.ts';
import { StagePhysics } from './stage-physics.ts';

export class RigidBody {
  #rigidBody?: RAPIER.RigidBody;
  #colliders?: RAPIER.Collider[];

  constructor(private desc: RAPIER.RigidBodyDesc, private colliderDescs: RAPIER.ColliderDesc[]) {
  }

  #ensureRigidBody(actor: Actor): RAPIER.RigidBody | undefined {
    if (this.#rigidBody) { return this.#rigidBody; }

    if (!actor.stage) { return undefined; }

    const stagePhysics = actor.stage?.get(StagePhysics);
    if (!stagePhysics) { return undefined; }

    const translation = actor.transform.translation;
    const rotation = actor.transform.rotation;

    this.#rigidBody = stagePhysics.world.createRigidBody(this.desc);

    this.#colliders = [];
    for (const collider of this.colliderDescs) {
      this.#colliders.push(stagePhysics.world.createCollider(collider, this.#rigidBody));
    }

    this.#rigidBody.setTranslation(translation, true);
    this.#rigidBody.setRotation(rotation, true);
    return this.#rigidBody;
  }

  get rigidBody() {
    return this.#rigidBody;
  }

  get collider() {
    return this.#colliders?.[0];
  }

  clone() {
    return new RigidBody(this.desc, this.colliderDescs);
  }

  addToStage(stage: Stage, actor: Actor) {
    this.#ensureRigidBody(actor);
  }

  removeFromStage(stage: Stage, actor: Actor) {
    if (!this.#rigidBody) { return; }

    let stagePhysics = stage.get(StagePhysics);
    if (!stagePhysics) { return; }
    stagePhysics.world.removeRigidBody(this.#rigidBody);

    this.#rigidBody = undefined;
    this.#colliders = undefined;
  }

  static TickOrder = 1;
  onTick(tickData: TickData, actor: Actor) {
    let rigidBody = this.#ensureRigidBody(actor);
    if (!rigidBody) { return; }

    const translation = rigidBody.translation();
    const rotation = rigidBody.rotation();
    actor.transform.translation = [translation.x, translation.y, translation.z];
    actor.transform.rotation = [rotation.x, rotation.y, rotation.z, rotation.w];
  }
}