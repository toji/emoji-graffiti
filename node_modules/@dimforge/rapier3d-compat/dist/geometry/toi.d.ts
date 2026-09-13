import { Collider } from "./collider";
import { Vector } from "../math";
/**
 * The intersection between a ray and a collider.
 */
export declare class ShapeCastHit {
    /**
     * The time of impact of the two shapes.
     */
    time_of_impact: number;
    /**
     * The local-space contact point on the first shape, at
     * the time of impact.
     */
    witness1: Vector;
    /**
     * The local-space contact point on the second shape, at
     * the time of impact.
     */
    witness2: Vector;
    /**
     * The local-space normal on the first shape, at
     * the time of impact.
     */
    normal1: Vector;
    /**
     * The local-space normal on the second shape, at
     * the time of impact.
     */
    normal2: Vector;
    constructor(time_of_impact: number, witness1: Vector, witness2: Vector, normal1: Vector, normal2: Vector);
    static fromBuffer(collider: Collider, buffer: Float32Array, target?: ShapeCastHit): ShapeCastHit;
}
/**
 * The intersection between a ray and a collider.
 */
export declare class ColliderShapeCastHit extends ShapeCastHit {
    /**
     * The handle of the collider hit by the ray.
     */
    collider: Collider;
    constructor(collider: Collider, time_of_impact: number, witness1: Vector, witness2: Vector, normal1: Vector, normal2: Vector);
    static fromBuffer(collider: Collider, buffer: Float32Array, target?: ColliderShapeCastHit): ColliderShapeCastHit;
}
