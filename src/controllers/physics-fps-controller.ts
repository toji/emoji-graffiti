import { Vec3, Quat, Vec2 } from 'gl-matrix';
import { Actor } from '../core/actor.js';
import { Stage, TickData } from '../core/stage.js';
import { ControllerInput } from './controller-input.js';
import RAPIER from '@dimforge/rapier3d-compat';
import { StagePhysics } from '../physics/stage-physics.ts';
import { StaticCollider } from '../physics/static-collider.ts';
import { RigidBody } from '../physics/rigid-body.ts';
import { Collection } from 'nipplejs/Collection';
import { PlayerActions } from './action-manager.ts';

const tmpDir = new Vec3();
const tmpQuat = new Quat();

const PlayerHalfHeight = 0.75;

export class PhysicsFPSController {
  speed = 0.01;
  angles = new Vec2();
  rotation = new Quat();
  flying = false;
  noclip = false;
  #onGround = false;
  #yVelocity = 0;

  gravity = -1; //-9.81;
  jumpVelocity = 0.3;

  #physicsController?: RAPIER.KinematicCharacterController;
  #collider?: RAPIER.Collider;
  #rigidBody?: RAPIER.RigidBody;

  constructor() {}

  setAngles(x: number, y: number) {
    this.angles[0] = x;
    this.angles[1] = y;

    // Update the tranform rotation
    const q = this.rotation;
    q.identity();
    Quat.rotateY(q, q, -this.angles[1]);
    Quat.rotateX(q, q, -this.angles[0]);
  }

  #rotateView(look: Vec2) {
    // Keep our rotation in the range of [0, 2*PI]
    // (Prevents numeric instability if you spin around a LOT.)
    this.angles[1] = (this.angles[1] + (look[0] * 0.025)) % (Math.PI * 2.0);

    this.angles[0] += look[1] * 0.025;
    // Clamp the up/down rotation to prevent us from flipping upside-down
    this.angles[0] = Math.min(Math.max(this.angles[0], -Math.PI*0.5), Math.PI*0.5);

    // Update the tranform rotation
    const q = this.rotation;
    q.identity();
    Quat.rotateY(q, q, -this.angles[1]);
    Quat.rotateX(q, q, -this.angles[0]);
  }

  #ensurePhysicsController(actor: Actor): RAPIER.KinematicCharacterController | undefined {
    if (this.#physicsController) { return this.#physicsController; }

    if (!actor.stage) { return undefined; }

    const stagePhysics = actor.stage?.get(StagePhysics);
    if (!stagePhysics) { return undefined; }

    this.#physicsController = stagePhysics.world.createCharacterController(0.1);
    this.#physicsController.enableAutostep(0.5, 0.2, true);
    this.#rigidBody = stagePhysics.world.createRigidBody(RAPIER.RigidBodyDesc.kinematicPositionBased());

    const capsule = RAPIER.ColliderDesc.capsule(PlayerHalfHeight, 0.4);
    this.#collider = stagePhysics.world.createCollider(capsule, this.#rigidBody);
    this.#collider?.setTranslationWrtParent({x: 0, y: -PlayerHalfHeight, z: 0});
    this.#rigidBody.setTranslation(actor.worldTransform.translation, true);
  }

  addToStage(stage: Stage, actor: Actor) {
    this.#ensurePhysicsController(actor);
  }

  removeFromStage(stage: Stage, actor: Actor) {
    if (!this.#physicsController) { return; }

    let stagePhysics = stage.get(StagePhysics);
    if (!stagePhysics) { return; }

    stagePhysics.world.removeCharacterController(this.#physicsController);
    this.#physicsController = undefined;
  }

  static TickOrder = 1;
  onTick(tickData: TickData, actor: Actor) {
    let controller = this.#ensurePhysicsController(actor);
    if (!controller) { return; }

    if (!this.#rigidBody || !this.#collider) {
      console.warn('PhysicsFPSController has no RigidBody or Collider');
      return;
    }

    tickData.stage.query(PlayerActions).forEach((_: Actor, actions: PlayerActions) => {
      this.#rotateView(actions.look);

      if (!this.flying) {
        this.#yVelocity += this.#onGround ? 0 :((this.gravity / 1000) * tickData.delta);
      } else {
        this.#yVelocity = 0;
      }

      Vec3.set(tmpDir, actions.walk[0], 0, actions.walk[1]);

      if (actions.jump.pressed) {
        if (this.flying) {
          tmpDir[1] += 1.0;
        } else if (this.#onGround) {
          this.#yVelocity = this.jumpVelocity;
        }
      }

      if (actions.crouch.pressed) {
        if (this.flying) {
          tmpDir[1] -= 1.0;
        } else {
          // TODO
        }
      }

      if (tmpDir.sqrMag > 0 || this.#yVelocity !== 0) {
        if (this.flying) {
          Vec3.transformQuat(tmpDir, tmpDir, this.rotation);
        } else {
          // When not flying only consider horizontal rotation for movement.
          tmpQuat.identity();
          tmpQuat.rotateY(-this.angles[1]);
          Vec3.transformQuat(tmpDir, tmpDir, tmpQuat);
        }

        tmpDir.scale(this.speed * tickData.delta);

        // Emulate gravity, since the Rapier KinematicCharacterController effectively disables it.
        if (!this.flying) {
          tmpDir[1] += this.#yVelocity;
        }

        if (!this.noclip) {
          controller.computeColliderMovement(this.#collider!, tmpDir);
          const correctedMovement = controller.computedMovement();
          tmpDir[0] = correctedMovement.x;
          tmpDir[1] = correctedMovement.y;
          tmpDir[2] = correctedMovement.z;

          this.#onGround = controller.computedGrounded();
          if (this.#onGround) {
            this.#yVelocity = 0;
          }

           this.#rigidBody!.setNextKinematicTranslation(actor.transform.translation);
        }

        actor.transform.translationRef.add(tmpDir);
      }

      actor.transform.rotation = this.rotation;

      // Only process one PlayerActions
      return false;
    });
  }
}