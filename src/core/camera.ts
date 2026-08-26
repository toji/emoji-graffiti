// Copyright (c) 2025 Brandon Jones
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
 * A View is any viewport that needs to be represented by the renderer, for cameras, shadow maps, etc.
 */

import { Mat4 } from 'gl-matrix';

export class Camera {
  zNear: number = 1;
  zFar: number = 1024;

  constructor(init: {
    zNear?: number,
    zFar?: number,
  }) {
    this.zNear = init.zNear ?? this.zNear;
    this.zFar = init.zFar ?? this.zFar;
  }

  getProjection(projectionMat: Mat4) {
    throw new Error('Must be overriden in inherited Camera type');
  }
}

export class PerspectiveCamera extends Camera {
  static SharedComponent = true;

  // Projection Matrix values
  fieldOfView: number = Math.PI * 0.5; // 90 deg
  aspect: number = 1;

  constructor(init: {
    fieldOfView?: number,
    zNear?: number,
    zFar?: number,
    aspect?: number
  } = {}) {
    super(init);

    this.fieldOfView = init.fieldOfView ?? this.fieldOfView;
    this.zNear = init.zNear ?? this.zNear;
    this.zFar = init.zFar ?? this.zFar;
    this.aspect = init.aspect ?? this.aspect;
  }

  getProjection(projectionMat: Mat4) {
    // Note: Reversed Z
    projectionMat.perspectiveZO(this.fieldOfView, this.aspect, this.zFar, this.zNear);
  }
}

export class OrthographicCamera extends Camera {
  static SharedComponent = true;

  // Ortho Matrix values
  left: number = -1;
  right: number = 1;
  bottom: number = -1;
  top: number = 1;

  constructor(init: {
    left?: number,
    right?: number,
    bottom?: number,
    top?: number,
    zNear?: number,
    zFar?: number,
  } = {}) {
    super(init);

    this.left = init.left ?? this.left;
    this.right = init.right ?? this.right;
    this.bottom = init.bottom ?? this.bottom;
    this.top = init.top ?? this.top;
    this.zNear = init.zNear ?? this.zNear;
    this.zFar = init.zFar ?? this.zFar;
  }

  getProjection(projectionMat: Mat4) {
    // Note: Reversed Z
    projectionMat.orthoZO(this.left, this.right, this.bottom, this.top, this.zFar, this.zNear);
  }
}