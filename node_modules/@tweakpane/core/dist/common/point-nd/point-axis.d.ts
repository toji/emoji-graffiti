import { Constraint } from '../constraint/constraint.js';
import { NumberTextProps } from '../number/view/number-text.js';
import { PointDimensionParams } from '../params.js';
export interface PointAxis {
    constraint: Constraint<number> | undefined;
    textProps: NumberTextProps;
}
export declare function createPointAxis(config: {
    constraint: Constraint<number> | undefined;
    initialValue: number;
    params: PointDimensionParams;
}): PointAxis;
