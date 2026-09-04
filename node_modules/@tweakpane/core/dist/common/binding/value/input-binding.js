import { Emitter } from '../../model/emitter.js';
import { isBinding } from '../binding.js';
/**
 * @hidden
 */
export class InputBindingValue {
    constructor(value, binding) {
        this.onValueBeforeChange_ = this.onValueBeforeChange_.bind(this);
        this.onValueChange_ = this.onValueChange_.bind(this);
        this.binding = binding;
        this.value_ = value;
        this.value_.emitter.on('beforechange', this.onValueBeforeChange_);
        this.value_.emitter.on('change', this.onValueChange_);
        this.emitter = new Emitter();
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
        this.value_.rawValue = this.binding.read();
    }
    push() {
        this.binding.write(this.value_.rawValue);
    }
    onValueBeforeChange_(ev) {
        this.emitter.emit('beforechange', Object.assign(Object.assign({}, ev), { sender: this }));
    }
    onValueChange_(ev) {
        this.push();
        this.emitter.emit('change', Object.assign(Object.assign({}, ev), { sender: this }));
    }
}
export function isInputBindingValue(v) {
    if (!('binding' in v)) {
        return false;
    }
    const b = v['binding'];
    return isBinding(b) && 'read' in b && 'write' in b;
}
