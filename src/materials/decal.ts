import { Mat4 } from "gl-matrix"

export class Decal {
  static SharedComponent = true;

  texture: GPUTexture;
  projection: Mat4 = new Mat4();

  constructor(texture: GPUTexture) {
    this.texture = texture;
    this.projection.perspectiveZO(Math.PI/4, 1, 0.1, 3);
  }
}