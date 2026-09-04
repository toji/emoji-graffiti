import { Constraint } from '../constraint/constraint.js';
import { Emitter } from './emitter.js';
import { Value, ValueChangeOptions, ValueEvents } from './value.js';
interface Config<T> {
    constraint?: Constraint<T>;
    equals?: (v1: T, v2: T) => boolean;
}
/**
 * A complex value that has constraint and comparator.
 * @template T the type of the raw value.
 */
export declare class ComplexValue<T> implements Value<T> {
    readonly emitter: Emitter<ValueEvents<T>>;
    private readonly constraint_;
    private readonly equals_;
    private rawValue_;
    constructor(initialValue: T, config?: Config<T>);
    get constraint(): Constraint<T> | undefined;
    get rawValue(): T;
    set rawValue(rawValue: T);
    setRawValue(rawValue: T, options?: ValueChangeOptions): void;
}
export {};
