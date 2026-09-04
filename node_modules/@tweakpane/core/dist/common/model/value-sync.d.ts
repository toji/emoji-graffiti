import { Value } from './value.js';
/**
 * Synchronizes two values.
 */
export declare function connectValues<T1, T2>({ primary, secondary, forward, backward, }: {
    primary: Value<T1>;
    secondary: Value<T2>;
    forward: (primary: T1, secondary: T2) => T2;
    backward: (primary: T1, secondary: T2) => T1;
}): void;
