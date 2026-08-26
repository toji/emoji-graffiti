import { Vec3, Mat4 } from 'gl-matrix';
import { Actor } from '../core/actor.js';
import { TickData } from '../core/stage.js';
import { ControllerInput } from './controller-input.js';

const tmpMat = new Mat4();

export class OrbitController extends ControllerInput {
  orbitX = 0;
  orbitY = 0;
  maxOrbitX = Math.PI * 0.5;
  minOrbitX = -Math.PI * 0.5;
  maxOrbitY = Math.PI;
  minOrbitY = -Math.PI;
  constrainXOrbit = true;
  constrainYOrbit = false;

  maxDistance = 10;
  minDistance = 1;
  distanceStep = 0.005;
  constrainDistance = true;
  autorotate = true;

  #distance = new Vec3(0, 0, 3);
  #target = new Vec3();

  constructor(element?: HTMLElement) {
    super(element);

    // If autorotate is enabled, do a slow rotation around the target until
    // the view is manually interacted with.
    if (this.autorotate) {
      const autorotateFrame = () => {
        if (this.autorotate) {
          requestAnimationFrame(autorotateFrame);
          this.orbit(-0.001, 0);
        }
      }
      requestAnimationFrame(autorotateFrame);
    }
  }

  protected onMouseMove(xDelta: number, yDelta: number): void {
    if (this.mousePressed(0)) {
      this.autorotate = false;
      this.orbit(xDelta * 0.025, yDelta * 0.025);
    }
  }

  protected onScroll(delta: number): void {
    this.distance = this.#distance[2] + (delta * this.distanceStep);
  }

  orbit(xDelta: number, yDelta: number) {
    if(xDelta || yDelta) {
      this.orbitY += xDelta;
      if(this.constrainYOrbit) {
          this.orbitY = Math.min(Math.max(this.orbitY, this.minOrbitY), this.maxOrbitY);
      } else {
          while (this.orbitY < -Math.PI) {
              this.orbitY += Math.PI * 2;
          }
          while (this.orbitY >= Math.PI) {
              this.orbitY -= Math.PI * 2;
          }
      }

      this.orbitX += yDelta;
      if(this.constrainXOrbit) {
          this.orbitX = Math.min(Math.max(this.orbitX, this.minOrbitX), this.maxOrbitX);
      } else {
          while (this.orbitX < -Math.PI) {
              this.orbitX += Math.PI * 2;
          }
          while (this.orbitX >= Math.PI) {
              this.orbitX -= Math.PI * 2;
          }
      }
    }
  }

  get target() {
    return [this.#target[0], this.#target[1], this.#target[2]];
  }

  set target(value) {
    this.#target[0] = value[0];
    this.#target[1] = value[1];
    this.#target[2] = value[2];
  };

  get distance() {
    return this.#distance[2];
  };

  set distance(value: number) {
    this.#distance[2] = value;
    if(this.constrainDistance) {
      this.#distance[2] = Math.min(Math.max(this.#distance[2], this.minDistance), this.maxDistance);
    }
  };

  onTick(tickData: TickData, actor: Actor) {
    tmpMat.identity();

    tmpMat.translate(this.#target);
    tmpMat.rotateY(-this.orbitY);
    tmpMat.rotateX(-this.orbitX);
    tmpMat.translate(this.#distance);

    actor.transform.matrix = tmpMat;
  }
}