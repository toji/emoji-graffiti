import { Vector } from "../math";
import { RawRayColliderIntersection, RawRayColliderHit, RawRayIntersection } from "../raw";
import { Collider } from "./collider";
import { FeatureType } from "./feature";
import { ColliderSet } from "./collider_set";
/**
 * A ray. This is a directed half-line.
 */
export declare class Ray {
    /**
     * The starting point of the ray.
     */
    origin: Vector;
    /**
     * The direction of propagation of the ray.
     */
    dir: Vector;
    /**
     * Builds a ray from its origin and direction.
     *
     * @param origin - The ray's starting point.
     * @param dir - The ray's direction of propagation.
     */
    constructor(origin: Vector, dir: Vector);
    pointAt(t: number): Vector;
}
/**
 * The intersection between a ray and a collider.
 */
export declare class RayIntersection {
    /**
     * The time-of-impact of the ray with the collider.
     *
     * The hit point is obtained from the ray's origin and direction: `origin + dir * timeOfImpact`.
     */
    timeOfImpact: number;
    /**
     * The normal of the collider at the hit point.
     */
    normal: Vector;
    /**
     * The type of the geometric feature the point was projected on.
     */
    featureType: FeatureType;
    /**
     * The id of the geometric feature the point was projected on.
     */
    featureId: number | undefined;
    constructor(timeOfImpact: number, normal: Vector, featureType?: FeatureType, featureId?: number);
    /**
     * @param raw - The raw intersection returned by the WASM query. It is freed by this method.
     * @param target - If provided, this object is populated and returned instead of
     * allocating a new one.
     */
    static fromBuffer(raw: RawRayIntersection, target?: RayIntersection): RayIntersection;
}
/**
 * The intersection between a ray and a collider (includes the collider handle).
 */
export declare class RayColliderIntersection {
    /**
     * The collider hit by the ray.
     */
    collider: Collider;
    /**
     * The time-of-impact of the ray with the collider.
     *
     * The hit point is obtained from the ray's origin and direction: `origin + dir * timeOfImpact`.
     */
    timeOfImpact: number;
    /**
     * The normal of the collider at the hit point.
     */
    normal: Vector;
    /**
     * The type of the geometric feature the point was projected on.
     */
    featureType: FeatureType;
    /**
     * The id of the geometric feature the point was projected on.
     */
    featureId: number | undefined;
    constructor(collider: Collider, timeOfImpact: number, normal: Vector, featureType?: FeatureType, featureId?: number);
    /**
     * @param colliderSet - The set the hit collider belongs to.
     * @param raw - The raw intersection returned by the WASM query. It is freed by this method.
     * @param target - If provided, this object is populated and returned instead of
     * allocating a new one.
     */
    static fromBuffer(colliderSet: ColliderSet, raw: RawRayColliderIntersection, target?: RayColliderIntersection): RayColliderIntersection;
}
/**
 * The time of impact between a ray and a collider.
 */
export declare class RayColliderHit {
    /**
     * The handle of the collider hit by the ray.
     */
    collider: Collider;
    /**
     * The time-of-impact of the ray with the collider.
     *
     * The hit point is obtained from the ray's origin and direction: `origin + dir * timeOfImpact`.
     */
    timeOfImpact: number;
    constructor(collider: Collider, timeOfImpact: number);
    static fromRaw(colliderSet: ColliderSet, raw: RawRayColliderHit): RayColliderHit;
}
