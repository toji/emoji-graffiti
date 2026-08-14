import { Geometry } from '../geometry.ts';

export class BoxGeometry extends Geometry {
  constructor(device: GPUDevice, desc: {
    width?: number,
    height?: number,
    depth?: number,
    x?: number,
    y?: number,
    z?: number,
  } = {}) {
    const w = (desc.width ?? 1) * 0.5;
    const h = (desc.height ?? 1) * 0.5;
    const d = (desc.depth ?? 1) * 0.5;

    const x = desc.x ?? 0;
    const y = desc.y ?? 0;
    const z = desc.z ?? 0;

    const boxVertArray = new Float32Array([
      //position,     normal,    uv,
      x+w, y-h, z+d,  0, -1, 0,  1, 1,
      x-w, y-h, z+d,  0, -1, 0,  0, 1,
      x-w, y-h, z-d,  0, -1, 0,  0, 0,
      x+w, y-h, z-d,  0, -1, 0,  1, 0,
      x+w, y-h, z+d,  0, -1, 0,  1, 1,
      x-w, y-h, z-d,  0, -1, 0,  0, 0,

      x+w, y+h, z+d,  1, 0, 0,   1, 1,
      x+w, y-h, z+d,  1, 0, 0,   0, 1,
      x+w, y-h, z-d,  1, 0, 0,   0, 0,
      x+w, y+h, z-d,  1, 0, 0,   1, 0,
      x+w, y+h, z+d,  1, 0, 0,   1, 1,
      x+w, y-h, z-d,  1, 0, 0,   0, 0,

      x-w, y+h, z+d,  0, 1, 0,   1, 1,
      x+w, y+h, z+d,  0, 1, 0,   0, 1,
      x+w, y+h, z-d,  0, 1, 0,   0, 0,
      x-w, y+h, z-d,  0, 1, 0,   1, 0,
      x-w, y+h, z+d,  0, 1, 0,   1, 1,
      x+w, y+h, z-d,  0, 1, 0,   0, 0,

      x-w, y-h, z+d,  -1, 0, 0,  1, 1,
      x-w, y+h, z+d,  -1, 0, 0,  0, 1,
      x-w, y+h, z-d,  -1, 0, 0,  0, 0,
      x-w, y-h, z-d,  -1, 0, 0,  1, 0,
      x-w, y-h, z+d,  -1, 0, 0,  1, 1,
      x-w, y+h, z-d,  -1, 0, 0,  0, 0,

      x+w, y+h, z+d,  0, 0, 1,   1, 1,
      x-w, y+h, z+d,  0, 0, 1,   0, 1,
      x-w, y-h, z+d,  0, 0, 1,   0, 0,
      x-w, y-h, z+d,  0, 0, 1,   0, 0,
      x+w, y-h, z+d,  0, 0, 1,   1, 0,
      x+w, y+h, z+d,  0, 0, 1,   1, 1,

      x+w, y-h, z-d,  0, 0, -1,  1, 1,
      x-w, y-h, z-d,  0, 0, -1,  0, 1,
      x-w, y+h, z-d,  0, 0, -1,  0, 0,
      x+w, y+h, z-d,  0, 0, -1,  1, 0,
      x+w, y-h, z-d,  0, 0, -1,  1, 1,
      x-w, y+h, z-d,  0, 0, -1,  0, 0,
    ]);

    super(device, {
      position: { values: boxVertArray, stride: 32 },
      normal: { values: boxVertArray, stride: 32, offset: 12 },
      texcoord0: { values: boxVertArray, stride: 32, offset: 24 },
    });
  }
}