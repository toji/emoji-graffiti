import { Constraint } from '../constraint/constraint.js';
import { ReadonlyValue, Value, ValueChangeOptions } from './value.js';
interface Config<T> {
    constraint?: Constraint<T>;
    equals?: (v1: T, v2: T) => boolean;
}
export declare function createValue<T>(initialValue: T, config?: Config<T>): Value<T>;
export type SetRawValue<T> = (rawValue: T, options?: ValueChangeOptions | undefined) => void;
export declare function createReadonlyValue<T>(value: Value<T>): [ReadonlyValue<T>, SetRawValue<T>];
export {};
