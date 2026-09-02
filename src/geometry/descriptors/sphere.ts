import { GeometryAttribute, GeometryDescriptor, GeometryIndexValues } from '../geometry.ts';
//import { GeometryBounds } from '../geometry-bounds.js';
import { Vec3 } from 'gl-matrix';

// Big swaths of this code lifted with love from Three.js
export class SphereGeometry implements GeometryDescriptor {
  position: GeometryAttribute;
  normal: GeometryAttribute;
  texcoord0: GeometryAttribute;
  indices: GeometryIndexValues;
  //bounds: GeometryBounds;

  constructor(desc: {
    radius?: number,
    widthSegments?: number,
    heightSegments?: number,
    x?: number,
    y?: number,
    z?: number,
  } = {}) {
    const radius = desc.radius ?? 0.5;
    const widthSegments = Math.max( 3, Math.floor( desc.widthSegments ?? 32 ) );
    const heightSegments = Math.max( 2, Math.floor( desc.heightSegments ?? 16 ) );

    const phiStart = 0;
    const phiLength = Math.PI * 2;
    const thetaStart = 0;
    const thetaLength = Math.PI;

    const thetaEnd = Math.min( thetaStart + thetaLength, Math.PI );

    const x = desc.x ?? 0;
    const y = desc.y ?? 0;
    const z = desc.z ?? 0;

    let index = 0;
    const grid = [];

    const vertex = new Vec3();
    const normal = new Vec3();

    // buffers
    const vertices = [];
    const indices = [];

    // generate vertices, normals and uvs
    for (let iy = 0; iy <= heightSegments; ++iy) {
      const verticesRow = [];
      const v = iy / heightSegments;

      // special case for the poles
      let uOffset = 0;
      if (iy == 0 && thetaStart == 0) {
        uOffset = 0.5 / widthSegments;
      } else if (iy == heightSegments && thetaEnd == Math.PI) {
        uOffset = - 0.5 / widthSegments;
      }

      for (let ix = 0; ix <= widthSegments; ++ix) {
        const u = ix / widthSegments;

        // vertex
        vertex[0] = -radius * Math.cos(phiStart + u * phiLength) * Math.sin(thetaStart + v * thetaLength);
        vertex[1] = radius * Math.cos(thetaStart + v * thetaLength);
        vertex[2] = radius * Math.sin(phiStart + u * phiLength) * Math.sin(thetaStart + v * thetaLength);

        vertices.push(vertex[0] + x, vertex[1] + y, vertex[2] + z);

        // normal
        Vec3.normalize(normal, vertex);
        vertices.push(normal[0], normal[1], normal[2]);

        // texcoord
        vertices.push(u + uOffset, 1 - v);

        verticesRow.push(index++);
      }

      grid.push(verticesRow);
    }

    // indices

    for (let iy = 0; iy < heightSegments; iy++) {
      for (let ix = 0; ix < widthSegments; ix++) {
        const a = grid[iy][ix + 1];
        const b = grid[iy][ix];
        const c = grid[iy + 1][ix];
        const d = grid[iy + 1][ix + 1];

        if (iy !== 0 || thetaStart > 0) indices.push(a, b, d);
        if (iy !== heightSegments - 1 || thetaEnd < Math.PI) indices.push(b, c, d);
      }
    }

    const vertexArray = new Float32Array(vertices);
    this.position = {values: vertexArray, stride: 32};
    this.normal = {values: vertexArray, stride: 32, offset: 12};
    this.texcoord0 = {values: vertexArray, stride: 32, offset: 24};
    this.indices = new Uint16Array(indices);
    /*this.bounds = new GeometryBounds({
      min: [x - radius, y - radius, z - radius],
      max: [x + radius, y + radius, z + radius]
    });*/
  }
}