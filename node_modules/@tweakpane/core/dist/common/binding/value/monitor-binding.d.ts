import { BufferedValue, BufferedValueEvents, TpBuffer } from '../../model/buffered-value.js';
import { Emitter } from '../../model/emitter.js';
import { ValueChangeOptions } from '../../model/value.js';
import { ReadonlyBinding } from '../readonly.js';
import { Ticker } from '../ticker/ticker.js';
import { BindingValue } from './binding.js';
/**
 * @hidden
 */
interface Config<T> {
    binding: ReadonlyBinding<T>;
    bufferSize: number;
    ticker: Ticker;
}
/**
 * @hidden
 */
export declare class MonitorBindingValue<T> implements BindingValue<TpBuffer<T>> {
    readonly binding: ReadonlyBinding<T>;
    readonly emitter: Emitter<BufferedValueEvents<T>>;
    readonly ticker: Ticker;
    private readonly value_;
    constructor(config: Config<T>);
    get rawValue(): TpBuffer<T>;
    set rawValue(rawValue: TpBuffer<T>);
    setRawValue(rawValue: TpBuffer<T>, options?: ValueChangeOptions | undefined): void;
    fetch(): void;
    private onTick_;
    private onValueBeforeChange_;
    private onValueChange_;
}
export declare function isMonitorBindingValue(v: BufferedValue<unknown>): v is MonitorBindingValue<unknown>;
export {};
