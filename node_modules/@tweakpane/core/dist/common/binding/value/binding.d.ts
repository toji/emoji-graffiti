import { Value } from '../../model/value.js';
import { Binding } from '../binding.js';
/**
 * @hidden
 */
export interface BindingValue<T> extends Value<T> {
    readonly binding: Binding;
    fetch(): void;
}
export declare function isBindingValue(v: unknown): v is BindingValue<unknown>;
