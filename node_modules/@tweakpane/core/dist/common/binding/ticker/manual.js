import { Emitter } from '../../model/emitter.js';
/**
 * @hidden
 */
export class ManualTicker {
    constructor() {
        this.disabled = false;
        this.emitter = new Emitter();
    }
    dispose() { }
    tick() {
        if (this.disabled) {
            return;
        }
        this.emitter.emit('tick', {
            sender: this,
        });
    }
}
