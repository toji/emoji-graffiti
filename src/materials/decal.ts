import { Mat4 } from "gl-matrix"

export class Decal {
  texture: GPUTexture;
  projection: Mat4 = new Mat4();

  constructor(texture: GPUTexture) {
    this.texture = texture;
    //this.projection.orthoZO(-1, 1, -1, 1, -1, 1);
    this.projection.perspectiveZO(Math.PI/4, 1, 0.1, 3);
  }
}