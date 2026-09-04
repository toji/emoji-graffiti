import { createPushedBuffer, initializeBuffer, } from '../../model/buffered-value.js';
import { Emitter } from '../../model/emitter.js';
import { createValue } from '../../model/values.js';
import { isBinding } from '../binding.js';
/**
 * @hidden
 */
export class MonitorBindingValue {
    constructor(config) {
        this.emitter = new Emitter();
        this.onTick_ = this.onTick_.bind(this);
        this.onValueBeforeChange_ = this.onValueBeforeChange_.bind(this);
        this.onValueChange_ = this.onValueChange_.bind(this);
        this.binding = config.binding;
        this.value_ = createValue(initializeBuffer(config.bufferSize));
        this.value_.emitter.on('beforechange', this.onValueBeforeChange_);
        this.value_.emitter.on('change', this.onValueChange_);
        this.ticker = config.ticker;
        this.ticker.emitter.on('tick', this.onTick_);
        this.fetch();
    }
    get rawValue() {
        return this.value_.rawValue;
    }
    set rawValue(rawValue) {
        this.value_.rawValue = rawValue;
    }
    setRawValue(rawValue, options) {
        this.value_.setRawValue(rawValue, options);
    }
    fetch() {
        this.value_.rawValue = createPushedBuffer(this.value_.rawValue, this.binding.read());
    }
    onTick_() {
        this.fetch();
    }
    onValueBeforeChange_(ev) {
        this.emitter.emit('beforechange', Object.assign(Object.assign({}, ev), { sender: this }));
    }
    onValueChange_(ev) {
        this.emitter.emit('change', Object.assign(Object.assign({}, ev), { sender: this }));
    }
}
export function isMonitorBindingValue(v) {
    if (!('binding' in v)) {
        return false;
    }
    const b = v['binding'];
    return isBinding(b) && 'read' in b && !('write' in b);
}
