import { Mat4 } from "gl-matrix"

export class Decal {
  static SharedComponent = true;

  textureIndex: number;
  projection: Mat4 = new Mat4();

  constructor(textureIndex: number) {
    this.textureIndex = textureIndex;
    this.projection.perspectiveZO(Math.PI/4, 1, 0.1, 4);
  }
}