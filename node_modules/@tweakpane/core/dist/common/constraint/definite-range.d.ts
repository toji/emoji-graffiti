import { ValueMap } from '../model/value-map.js';
import { Constraint } from './constraint.js';
interface Config {
    max: number;
    min: number;
}
/**
 * A number range constraint that cannot be undefined. Used for slider control.
 */
export declare class DefiniteRangeConstraint implements Constraint<number> {
    readonly values: ValueMap<{
        max: number;
        min: number;
    }>;
    constructor(config: Config);
    constrain(value: number): number;
}
export {};
