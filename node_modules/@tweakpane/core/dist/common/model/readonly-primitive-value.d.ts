import { Emitter } from './emitter.js';
import { ReadonlyValue, ReadonlyValueEvents, Value } from './value.js';
/**
 * @hidden
 */
export declare class ReadonlyPrimitiveValue<T> implements ReadonlyValue<T> {
    /**
     * The event emitter for value changes.
     */
    readonly emitter: Emitter<ReadonlyValueEvents<T>>;
    private value_;
    constructor(value: Value<T>);
    /**
     * The raw value of the model.
     */
    get rawValue(): T;
    private onValueBeforeChange_;
    private onValueChange_;
}
