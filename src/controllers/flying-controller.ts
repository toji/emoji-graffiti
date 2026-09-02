import { Vec3, Quat, Vec2 } from 'gl-matrix';
import { Actor } from '../core/actor.js';
import { TickData } from '../core/stage.js';
import { ControllerInput } from './controller-input.js';

const tmpDir = new Vec3();

export class FlyingController extends ControllerInput {
  speed = 0.01;
  angles = new Vec2();
  rotation = new Quat();

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

  static TickOrder = 1;
  onTick(tickData: TickData, actor: Actor) {
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
      tmpDir[1] += 1.0;
    }
    if (this.keyPressed('ShiftLeft')) {
      tmpDir[1] -= 1.0;
    }

    if (tmpDir[0] !== 0 || tmpDir[1] !== 0 || tmpDir[2] !== 0) {
      Vec3.transformQuat(tmpDir, tmpDir, this.rotation);
      Vec3.normalize(tmpDir, tmpDir);
      Vec3.scaleAndAdd(actor.transform.translationRef, actor.transform.translationRef, tmpDir, this.speed * tickData.delta);
    }

    actor.transform.rotation = this.rotation;
  }
}