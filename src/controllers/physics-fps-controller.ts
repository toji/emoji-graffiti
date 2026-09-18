import { Vec3, Quat, Vec2 } from 'gl-matrix';
import { Actor } from '../core/actor.js';
import { Stage, TickData } from '../core/stage.js';
import { ControllerInput } from './controller-input.js';
import RAPIER from '@dimforge/rapier3d-compat';
import { StagePhysics } from '../physics/stage-physics.ts';
import { StaticCollider } from '../physics/static-collider.ts';
import { RigidBody } from '../physics/rigid-body.ts';

const tmpDir = new Vec3();
const tmpQuat = new Quat();

export class PhysicsFPSController extends ControllerInput {
  speed = 0.01;
  angles = new Vec2();
  rotation = new Quat();
  flying = false;
  #onGround = false;
  #yVelocity = 0;

  gravity = -2; //-9.81;
  jumpVelocity = 0.5;

  #physicsController?: RAPIER.KinematicCharacterController;

  constructor(element: HTMLElement) {
    super(element);
  }

  setAngles(x: number, y: number) {
    this.angles[0] = x;
    this.angles[1] = y;

    // Update the tranform rotation
    const q = this.rotation;
    q.identity();
    Quat.rotateY(q, q, -this.angles[1]);
    Quat.rotateX(q, q, -this.angles[0]);
  }

  protected onMouseMove(xDelta: number, yDelta: number): void {
    if (this.mousePressed(0)) {
      // Keep our rotation in the range of [0, 2*PI]
      // (Prevents numeric instability if you spin around a LOT.)
      this.angles[1] = (this.angles[1] + (xDelta * 0.025)) % (Math.PI * 2.0);

      this.angles[0] += yDelta * 0.025;
      // Clamp the up/down rotation to prevent us from flipping upside-down
      this.angles[0] = Math.min(Math.max(this.angles[0], -Math.PI*0.5), Math.PI*0.5);

      // Update the tranform rotation
      const q = this.rotation;
      q.identity();
      Quat.rotateY(q, q, -this.angles[1]);
      Quat.rotateX(q, q, -this.angles[0]);
    }
  }

  #ensurePhysicsController(actor: Actor): RAPIER.KinematicCharacterController | undefined {
    if (this.#physicsController) { return this.#physicsController; }

    if (!actor.stage) { return undefined; }

    const stagePhysics = actor.stage?.get(StagePhysics);
    if (!stagePhysics) { return undefined; }

    this.#physicsController = stagePhysics.world.createCharacterController(0.2);
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

    const rigidBody = actor.get(RigidBody);
    if (!rigidBody) {
      console.warn('PhysicsFPSController attached to an actor with no RigidBody');
      return;
    }

    const collider = rigidBody?.collider;
    if (!collider) {
      console.warn('RigidBody has no active colliders');
      return;
    }

    if (!this.flying) {
      this.#yVelocity += ((this.gravity / 1000) * tickData.delta);
    } else {
      this.#yVelocity = 0;
    }

    // Handle keyboard state.
    Vec3.set(tmpDir, 0, 0, 0);
    if (this.keyPressed('KeyW')) {
      tmpDir[2] -= 1.0;
    }
    if (this.keyPressed('KeyS')) {
      tmpDir[2] += 1.0;
    }
    if (this.keyPressed('KeyA')) {
      tmpDir[0] -= 1.0;
    }
    if (this.keyPressed('KeyD')) {
      tmpDir[0] += 1.0;
    }
    if (this.keyPressed('Space')) {
      if (this.flying) {
        tmpDir[1] += 1.0;
      } else if (this.#onGround) {
        this.#yVelocity = this.jumpVelocity;
      }
    }
    if (this.keyPressed('ShiftLeft')) {
      if (this.flying) {
        tmpDir[1] -= 1.0;
      } else {
        // TODO: Crouch? Run?
      }
    }

    if (tmpDir[0] !== 0 || tmpDir[1] !== 0 || tmpDir[2] !== 0 || this.#yVelocity !== 0) {
      if (this.flying) {
        Vec3.transformQuat(tmpDir, tmpDir, this.rotation);
      } else {
        // When not flying only consider horizontal rotation for movement.
        tmpQuat.identity();
        tmpQuat.rotateY(-this.angles[1]);
        Vec3.transformQuat(tmpDir, tmpDir, tmpQuat);
      }

      tmpDir.normalize();
      tmpDir.scale(this.speed * tickData.delta);

      // Emulate gravity, since the Rapier KinematicCharacterController effectively disables it.
      if (!this.flying) {
        tmpDir[1] += this.#yVelocity;
      }

      controller.computeColliderMovement(collider, tmpDir);
      const correctedMovement = controller.computedMovement();
      tmpDir[0] = correctedMovement.x;
      tmpDir[1] = correctedMovement.y;
      tmpDir[2] = correctedMovement.z;

      this.#onGround = controller.computedGrounded();
      if (this.#onGround) {
        this.#yVelocity = 0;
      }

      tmpDir.add(actor.transform.translation);

      rigidBody.rigidBody!.setTranslation(tmpDir, true);
    }

    rigidBody.rigidBody!.setRotation(this.rotation, true);
  }
}