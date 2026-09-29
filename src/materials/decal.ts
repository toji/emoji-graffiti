import { Mat4, Vec4 } from "gl-matrix"

let NEXT_ID = 1;

export class Decal {
  static SharedComponent = true;

  id: number;
  emoji: any;
  textureIndex: number;
  baseColorFactor: Vec4 = new Vec4(1, 1, 1, 1);
  projection: Mat4 = new Mat4();

  constructor(emoji: any, textureIndex: number) {
    this.id = NEXT_ID++;
    this.emoji = emoji;
    this.textureIndex = textureIndex;
    this.projection.perspectiveZO(Math.PI/4, 1, 0.1, 4.5);
  }

  clone(): Decal {
    const out = new Decal(this.emoji, this.textureIndex);
    out.baseColorFactor.copy(this.baseColorFactor);
    out.projection.copy(this.projection);
    return out;
  }
}