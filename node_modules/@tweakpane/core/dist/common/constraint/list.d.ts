import { ValueMap } from '../model/value-map.js';
import { Constraint } from './constraint.js';
export interface ListItem<T> {
    text: string;
    value: T;
}
/**
 * A list constranit.
 * @template T The type of the value.
 */
export declare class ListConstraint<T> implements Constraint<T> {
    readonly values: ValueMap<{
        options: ListItem<T>[];
    }>;
    constructor(options: ListItem<T>[]);
    constrain(value: T): T;
}
