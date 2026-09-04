import { Value, ValueEvents } from './value.js';
/**
 * A buffer. Prefixed to avoid conflicts with the Node.js built-in class.
 * @template T
 */
export type TpBuffer<T> = (T | undefined)[];
export type BufferedValue<T> = Value<TpBuffer<T>>;
export type BufferedValueEvents<T> = ValueEvents<TpBuffer<T>>;
export declare function initializeBuffer<T>(bufferSize: number): TpBuffer<T>;
export declare function createPushedBuffer<T>(buffer: TpBuffer<T>, newValue: T): TpBuffer<T>;
