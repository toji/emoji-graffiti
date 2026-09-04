import { Constraint } from '../constraint/constraint.js';
export declare function getDimensionProps(c: Constraint<number>): {
    max: number | undefined;
    min: number | undefined;
    step: number | undefined;
};
