import { RawNarrowPhase, RawContactManifold } from "../raw";
import { ColliderHandle } from "./collider";
import { RigidBodySet } from "../dynamics";
import { Vector } from "../math";
/**
 * The narrow-phase used for precise collision-detection.
 *
 * To avoid leaking WASM resources, this MUST be freed manually with `narrowPhase.free()`
 * once you are done using it.
 */
export declare class NarrowPhase {
    raw: RawNarrowPhase;
    tempManifold: TempContactManifold;
    /**
     * Release the WASM memory occupied by this narrow-phase.
     */
    free(): void;
    constructor(raw?: RawNarrowPhase);
    /**
     * Enumerates all the colliders potentially in contact with the given collider.
     *
     * @param collider1 - The second collider involved in the contact.
     * @param f - Closure that will be called on each collider that is in contact with `collider1`.
     */
    contactPairsWith(collider1: ColliderHandle, f: (collider2: ColliderHandle) => void): void;
    /**
     * Enumerates all the colliders intersecting the given colliders, assuming one of them
     * is a sensor.
     */
    intersectionPairsWith(collider1: ColliderHandle, f: (collider2: ColliderHandle) => void): void;
    /**
     * Iterates through all the contact manifolds between the given pair of colliders.
     *
     * @param collider1 - The first collider involved in the contact.
     * @param collider2 - The second collider involved in the contact.
     * @param bodies - The set of rigid-bodies the colliders are attached to. Solver contacts are
     *                 anchored in body-local space, so this is needed to read them back in world-space.
     * @param f - Closure that will be called on each contact manifold between the two colliders. If the second argument
     *            passed to this closure is `true`, then the contact manifold data is flipped, i.e., methods like `localNormal1`
     *            actually apply to the `collider2` and fields like `localNormal2` apply to the `collider1`.
     */
    contactPair(collider1: ColliderHandle, collider2: ColliderHandle, bodies: RigidBodySet, f: (manifold: TempContactManifold, flipped: boolean) => void): void;
    /**
     * Returns `true` if `collider1` and `collider2` intersect and at least one of them is a sensor.
     * @param collider1 − The first collider involved in the intersection.
     * @param collider2 − The second collider involved in the intersection.
     */
    intersectionPair(collider1: ColliderHandle, collider2: ColliderHandle): boolean;
}
export declare class TempContactManifold {
    raw: RawContactManifold;
    /** The bodies the manifold's solver contacts are anchored to. */
    bodies: RigidBodySet;
    free(): void;
    constructor(raw: RawContactManifold, bodies?: RigidBodySet);
    /**
     * The contact normal of the manifold, expressed in world-space.
     *
     * @param {Vector?} target - The object to be populated. If provided,
     * the function returns this object instead of creating a new one.
     */
    normal(target?: Vector): Vector;
    /**
     * The contact normal of the manifold, expressed in the local-space of the first shape.
     *
     * @param {Vector?} target - The object to be populated. If provided,
     * the function returns this object instead of creating a new one.
     */
    localNormal1(target?: Vector): Vector;
    /**
     * The contact normal of the manifold, expressed in the local-space of the second shape.
     *
     * @param {Vector?} target - The object to be populated. If provided,
     * the function returns this object instead of creating a new one.
     */
    localNormal2(target?: Vector): Vector;
    subshape1(): number;
    subshape2(): number;
    numContacts(): number;
    /**
     * The local-space contact point on the first shape, for the `i`-th contact.
     *
     * @param {number} i - The index of the contact to read.
     * @param {Vector?} target - The object to be populated. If provided,
     * the function returns this object instead of creating a new one.
     */
    localContactPoint1(i: number, target?: Vector): Vector | null;
    /**
     * The local-space contact point on the second shape, for the `i`-th contact.
     *
     * @param {number} i - The index of the contact to read.
     * @param {Vector?} target - The object to be populated. If provided,
     * the function returns this object instead of creating a new one.
     */
    localContactPoint2(i: number, target?: Vector): Vector | null;
    contactDist(i: number): number;
    contactFid1(i: number): number;
    contactFid2(i: number): number;
    contactImpulse(i: number): number;
    contactTangentImpulseX(i: number): number;
    contactTangentImpulseY(i: number): number;
    numSolverContacts(): number;
    /**
     * The world-space position of the `i`-th solver contact point.
     *
     * @param {number} i - The index of the solver contact to read.
     * @param {Vector?} target - The object to be populated. If provided,
     * the function returns this object instead of creating a new one.
     */
    solverContactPoint(i: number, target?: Vector): Vector | null;
    solverContactDist(i: number): number;
    /**
     * The friction coefficient applied to this manifold's solver contacts. It is combined
     * once per manifold, so every solver contact of this manifold shares it.
     */
    friction(): number;
    /**
     * The restitution coefficient applied to this manifold's solver contacts. It is
     * combined once per manifold, so every solver contact of this manifold shares it.
     */
    restitution(): number;
    /**
     * The tangent (surface) velocity of the `i`-th solver contact point.
     *
     * @param {number} i - The index of the solver contact to read.
     * @param {Vector?} target - The object to be populated. If provided,
     * the function returns this object instead of creating a new one.
     */
    solverContactTangentVelocity(i: number, target?: Vector): Vector;
}
