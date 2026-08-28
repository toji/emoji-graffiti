// Copyright (c) 2024 Brandon Jones
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

/**
 * A Transform is defined either by a translation/rotation/scale or a matrix,
 * automatically building whichever elements aren't provided.
 */

import { Vec3, Mat4, Quat, Mat4Like, Vec3Like, QuatLike, Mat3 } from 'gl-matrix';

const DEFAULT_TRANSLATION = new Vec3();
const DEFAULT_ROTATION = new Quat(0, 0, 0, 1);
const DEFAULT_SCALE = new Vec3(1, 1, 1);

export class Transform {
  #matrix?: Mat4;
  #normalMatrix?: Mat3;
  #translation?: Vec3;
  #rotation?: Quat;
  #scale?: Vec3;

  #matrixRev = -1;
  #normalMatrixRev = -1;
  #trsRev = -1;
  #revision = 0;

  #changeCallback?: () => void;

  constructor(desc?: {
    translation?: Vec3Like,
    rotation?: QuatLike,
    scale?: Vec3Like,
    matrix?: Mat4Like,
    onChange: () => void
  }) {
    if (!desc) {
      this.#matrix = new Mat4();
      this.#matrixRev = 0;
    } else if(desc.matrix) {
      this.#matrix = new Mat4(desc?.matrix);
      this.#matrixRev = 0;
    } else {
      this.#translation = new Vec3(desc.translation ?? DEFAULT_TRANSLATION);
      this.#rotation = new Quat(desc.rotation ?? DEFAULT_ROTATION);
      this.#scale = new Vec3(desc.scale ?? DEFAULT_SCALE);
      this.#trsRev = 0;
    }

    this.#changeCallback = desc?.onChange;
  }

  // Incremented every time the transform changes to make it easier to track
  // when dependent values need to be updated.
  get revision(): number {
    return this.#revision;
  }

  #ensureMatrix() {
    if (this.#matrixRev != this.#revision) {
      if (!this.#matrix) {
        this.#matrix = new Mat4();
      }
      Mat4.fromRotationTranslationScale(this.#matrix, this.#rotation!, this.#translation!, this.#scale!);
      this.#matrixRev = this.#revision;
    }
  }

  /** Using the matrix getter returns a read-only version of the Matrix (in TypeScript at least)
   * to prevent you from altering the contents because calling this getter does not mark the
   * transform as updated. Use updateMatrix to get back a modifiable matrix.
   */
  get matrix(): Readonly<Mat4> {
    this.#ensureMatrix();
    return this.#matrix!;
  }

  /** Calling this marks the transform as updated, whether or not you alter the value, so only call
   * the *Ref variants when you intend to change the value.
   */
  get matrixRef(): Mat4 {
    this.#ensureMatrix();
    this.#matrixRev = ++this.#revision;
    this.#changeCallback?.();
    return this.#matrix!;
  }

  set matrix(value: Mat4Like) {
    if (!this.#matrix) {
      this.#matrix = new Mat4(value);
    } else {
      this.#matrix.set(value);
    }
    this.#matrixRev = ++this.#revision;
    this.#changeCallback?.();
  }

  // Gets the corresponding 3x3 normalMatrix for this transform.
  // Cannot be set directly. Never initialized unless requested.
  get normalMatrix(): Readonly<Mat3> {
    if (this.#normalMatrixRev != this.#revision) {
      if (!this.normalMatrix) {
        this.#normalMatrix = new Mat3();
      }
      Mat3.normalFromMat4(this.#normalMatrix!, this.matrix);
      this.#normalMatrixRev = this.#revision;
    }
    return this.#normalMatrix!;
  }

  get mirrored(): boolean {
    this.#ensureMatrix();
    return Mat4.determinant(this.#matrix!) < 0;
  }

  #ensureDecomposed() {
    if (this.#trsRev != this.#revision) {
      if (!this.#translation) {
        this.#translation = new Vec3();
        this.#rotation = new Quat();
        this.#scale = new Vec3();
      }
      Mat4.decompose(this.#rotation!, this.#translation!, this.#scale!, this.#matrix!);
      this.#trsRev = this.#revision;
    }
  }

  get translation(): Readonly<Vec3> {
    this.#ensureDecomposed();
    return this.#translation!;
  }

  get translationRef(): Vec3 {
    this.#ensureDecomposed();
    this.#trsRev = ++this.#revision;
    this.#changeCallback?.();
    return this.#translation!;
  }

  set translation(value: Vec3Like) {
    this.#ensureDecomposed();
    this.#trsRev = ++this.#revision;
    this.#changeCallback?.();
    this.#translation!.set(value);
  }

  get rotation(): Readonly<Quat> {
    this.#ensureDecomposed();
    return this.#rotation!;
  }

  get rotationRef(): Quat {
    this.#ensureDecomposed();
    this.#trsRev = ++this.#revision;
    this.#changeCallback?.();
    return this.#rotation!;
  }

  set rotation(value: QuatLike) {
    this.#ensureDecomposed();
    this.#trsRev = ++this.#revision;
    this.#changeCallback?.();
    this.#rotation!.set(value);
  }

  get scale(): Readonly<Vec3> {
    this.#ensureDecomposed();
    return this.#scale!;
  }

  get scaleRef(): Vec3 {
    this.#ensureDecomposed();
    this.#trsRev = ++this.#revision;
    this.#changeCallback?.();
    return this.#scale!;
  }

  set scale(value: Vec3Like) {
    this.#ensureDecomposed();
    this.#trsRev = ++this.#revision;
    this.#changeCallback?.();
    this.#scale!.set(value);
  }
}
