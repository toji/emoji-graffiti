import { CylinderGeometry } from './cylinder.js';

// Big swaths of this code lifted with love from Three.js
export class ConeGeometry extends CylinderGeometry {
  constructor(desc: {
    radius?: number,
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
    super({
      ...desc,
      radiusTop: 0,
      radiusBottom: desc.radius,
    });
  }
}