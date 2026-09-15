import { Mat4, Vec4 } from "gl-matrix"

export class Decal {
  static SharedComponent = true;

  emoji: any;
  textureIndex: number;
  baseColorFactor: Vec4 = new Vec4(1, 1, 1, 1);
  projection: Mat4 = new Mat4();

  constructor(emoji: any, textureIndex: number) {
    this.emoji = emoji;
    this.textureIndex = textureIndex;
    this.projection.perspectiveZO(Math.PI/4, 1, 0.1, 4);
  }

  clone(): Decal {
    const out = new Decal(this.emoji, this.textureIndex);
    out.baseColorFactor.copy(this.baseColorFactor);
    out.projection.copy(this.projection);
    return out;
  }
}