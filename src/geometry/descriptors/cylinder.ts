import { GeometryAttribute, GeometryDescriptor, GeometryIndexValues } from '../geometry.ts';
//import { GeometryBounds } from '../geometry-bounds.js';
import { Vec3 } from 'gl-matrix';

// Big swaths of this code lifted with love from Three.js
export class CylinderGeometry implements GeometryDescriptor {
  position: GeometryAttribute;
  normal: GeometryAttribute;
  texcoord0: GeometryAttribute;
  indices: GeometryIndexValues;
  //bounds: GeometryBounds;

  constructor(desc: {
    radiusTop?: number,
    radiusBottom?: number,
    height?: number,
    radialSegments?: number,
    heightSegments?: number,
    openEnded?: boolean,
    thetaStart?: number,
    thetaLength?: number,
    x?: number,
    y?: number,
    z?: number,
  } = {}) {
    const radiusTop = desc.radiusTop ?? 0.5;
    const radiusBottom = desc.radiusBottom ?? 0.5;
    const height = desc.height ?? 1;
    const radialSegments = Math.floor(desc.radialSegments ?? 32);
    const heightSegments = Math.floor(desc.heightSegments ?? 1);
    const openEnded = desc.openEnded ?? false;
    const thetaStart = desc.thetaStart ?? 0;
    const thetaLength = desc.thetaLength ?? Math.PI * 2;

    const offsetX = desc.x ?? 0;
    const offsetY = desc.y ?? 0;
    const offsetZ = desc.z ?? 0;

    // buffers
    const indices: number[] = [];
    const vertices: number[] = [];

    // helper variables
    let index = 0;
    const indexArray: number[][] = [];
    const halfHeight = height / 2;

    // generate geometry
    generateTorso();
    if ( openEnded === false ) {
      if (radiusTop > 0) generateCap(true);
      if (radiusBottom > 0) generateCap(false);
    }

    // build geometry
    function generateTorso() {
      const normal = new Vec3();

      // this will be used to calculate the normal
      const slope = (radiusBottom - radiusTop) / height;

      // generate vertices, normals and uvs
      for (let y = 0; y <= heightSegments; ++y) {
        const indexRow = [];
        const v = y / heightSegments;

        // calculate the radius of the current row
        const radius = v * (radiusBottom - radiusTop) + radiusTop;

        for (let x = 0; x <= radialSegments; ++x) {
          const u = x / radialSegments;
          const theta = u * thetaLength + thetaStart;

          const sinTheta = Math.sin(theta);
          const cosTheta = Math.cos(theta);

          // vertex
          vertices.push(
            radius * sinTheta + offsetX,
            (-v * height + halfHeight) + offsetY,
            radius * cosTheta + offsetZ
          );

          // normal
          Vec3.normalize(normal, [sinTheta, slope, cosTheta]);
          vertices.push(...normal);

          // uv
          vertices.push(u, 1 - v);

          // save index of vertex in respective row
          indexRow.push(index++);
        }

        // now save vertices of the row in our index array
        indexArray.push(indexRow);
      }

      // generate indices
      for (let x = 0; x < radialSegments; ++x) {
        for (let y = 0; y < heightSegments; ++y) {
          // we use the index array to access the correct indices
          const a = indexArray[y][x];
          const b = indexArray[y + 1][x];
          const c = indexArray[y + 1][x + 1];
          const d = indexArray[y][x + 1];

          // faces
          indices.push(a, b, d);
          indices.push(b, c, d);
        }
      }
    }

    function generateCap(top: boolean) {
      // save the index of the first center vertex
      const centerIndexStart = index;

      const radius = (top === true) ? radiusTop : radiusBottom;
      const sign = (top === true) ? 1 : -1;

      // first we generate the center vertex data of the cap.
      // because the geometry needs one set of uvs per face,
      // we must generate a center vertex per face/segment
      for (let x = 1; x <= radialSegments; ++x) {
        // vertex
        vertices.push(
          offsetX,
          halfHeight * sign + offsetY,
          offsetZ
        );

        // normal
        vertices.push(0, sign, 0);

        // uv
        vertices.push(0.5, 0.5);

        // increase index
        ++index;
      }

      // save the index of the last center vertex
      const centerIndexEnd = index;

      // now we generate the surrounding vertices, normals and uvs
      for (let x = 0; x <= radialSegments; ++x) {
        const u = x / radialSegments;
        const theta = u * thetaLength + thetaStart;

        const cosTheta = Math.cos(theta);
        const sinTheta = Math.sin(theta);

        // vertex
        vertices.push(
          radius * sinTheta + offsetX,
          halfHeight * sign + offsetY,
          radius * cosTheta + offsetZ
        );

        // normal
        vertices.push(0, sign, 0);

        // uv
        vertices.push(
          (cosTheta * 0.5) + 0.5,
          (sinTheta * 0.5 * sign) + 0.5
        );

        // increase index
        ++index;
      }

      // generate indices
      for (let x = 0; x < radialSegments; ++x) {
        const c = centerIndexStart + x;
        const i = centerIndexEnd + x;

        if (top === true) {
          // face top
          indices.push(i, i + 1, c);
        } else {
          // face bottom
          indices.push(i + 1, i, c);
        }
      }
    }

    const vertexArray = new Float32Array(vertices);

    this.position = {values: vertexArray, stride: 32};
    this.normal = {values: vertexArray, stride: 32, offset: 12};
    this.texcoord0 = {values: vertexArray, stride: 32, offset: 24};
    this.indices = new Uint16Array(indices);

    /*const maxRadius = Math.max(radiusTop, radiusBottom);
    this.bounds = new GeometryBounds({
      min: [offsetX - maxRadius, offsetY - halfHeight, offsetZ - maxRadius],
      max: [offsetX + maxRadius, offsetY + halfHeight, offsetZ + maxRadius]
    });*/
  }
}