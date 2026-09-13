import { Collider } from "./collider";
import { Vector } from "../math";
import { RawPointColliderProjection, RawPointProjection } from "../raw";
import { FeatureType } from "./feature";
import { ColliderSet } from "./collider_set";
/**
 * The projection of a point on a collider.
 */
export declare class PointProjection {
    /**
     * The projection of the point on the collider.
     */
    point: Vector;
    /**
     * Is the point inside of the collider?
     */
    isInside: boolean;
    constructor(point: Vector, isInside: boolean);
    /**
     * @param raw - The raw projection returned by the WASM query. It is freed by this method.
     * @param target - If provided, this object is populated and returned instead of
     * allocating a new one.
     */
    static fromBuffer(raw: RawPointProjection, target?: PointProjection): PointProjection;
}
/**
 * The projection of a point on a collider (includes the collider handle).
 */
export declare class PointColliderProjection {
    /**
     * The collider hit by the ray.
     */
    collider: Collider;
    /**
     * The projection of the point on the collider.
     */
    point: Vector;
    /**
     * Is the point inside of the collider?
     */
    isInside: boolean;
    /**
     * The type of the geometric feature the point was projected on.
     */
    featureType: FeatureType;
    /**
     * The id of the geometric feature the point was projected on.
     */
    featureId: number | undefined;
    constructor(collider: Collider, point: Vector, isInside: boolean, featureType?: FeatureType, featureId?: number);
    /**
     * @param colliderSet - The set the projected-on collider belongs to.
     * @param raw - The raw projection returned by the WASM query. It is freed by this method.
     * @param target - If provided, this object is populated and returned instead of
     * allocating a new one.
     */
    static fromBuffer(colliderSet: ColliderSet, raw: RawPointColliderProjection, target?: PointColliderProjection): PointColliderProjection;
}
