import { Emitter } from '../../model/emitter.js';
import { Ticker, TickerEvents } from './ticker.js';
/**
 * @hidden
 */
export declare class ManualTicker implements Ticker {
    readonly emitter: Emitter<TickerEvents>;
    disabled: boolean;
    constructor();
    dispose(): void;
    tick(): void;
}
