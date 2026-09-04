import { ReadonlyValue, Value } from '../model/value.js';
import { ValueMap } from '../model/value-map.js';
export declare function bindValue<T>(value: Value<T> | ReadonlyValue<T>, applyValue: (value: T) => void): void;
export declare function bindValueMap<O extends Record<string, unknown>, Key extends keyof O>(valueMap: ValueMap<O>, key: Key, applyValue: (value: O[Key]) => void): void;
