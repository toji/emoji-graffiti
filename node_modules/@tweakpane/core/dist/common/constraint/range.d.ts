import { ValueMap } from '../model/value-map.js';
import { Constraint } from './constraint.js';
interface Config {
    max?: number;
    min?: number;
}
/**
 * A number range constraint.
 */
export declare class RangeConstraint implements Constraint<number> {
    readonly values: ValueMap<{
        max: number | undefined;
        min: number | undefined;
    }>;
    constructor(config: Config);
    constrain(value: number): number;
}
export {};
