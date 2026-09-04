import { Emitter } from '../../model/emitter.js';
import { Value, ValueChangeOptions, ValueEvents } from '../../model/value.js';
import { ReadWriteBinding } from '../read-write.js';
import { BindingValue } from './binding.js';
/**
 * @hidden
 */
export declare class InputBindingValue<T> implements BindingValue<T> {
    readonly binding: ReadWriteBinding<T>;
    readonly emitter: Emitter<ValueEvents<T>>;
    private readonly value_;
    constructor(value: Value<T>, binding: ReadWriteBinding<T>);
    get rawValue(): T;
    set rawValue(rawValue: T);
    setRawValue(rawValue: T, options?: ValueChangeOptions | undefined): void;
    fetch(): void;
    push(): void;
    private onValueBeforeChange_;
    private onValueChange_;
}
export declare function isInputBindingValue(v: Value<unknown>): v is InputBindingValue<unknown>;
