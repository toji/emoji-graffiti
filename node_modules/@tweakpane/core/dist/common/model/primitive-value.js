import { Emitter } from './emitter.js';
/**
 * A value that has a primitive raw value.
 * @template T the type of the raw value.
 */
export class PrimitiveValue {
    constructor(initialValue) {
        this.emitter = new Emitter();
        this.value_ = initialValue;
    }
    get rawValue() {
        return this.value_;
    }
    set rawValue(value) {
        this.setRawValue(value, {
            forceEmit: false,
            last: true,
        });
    }
    setRawValue(value, options) {
        const opts = options !== null && options !== void 0 ? options : {
            forceEmit: false,
            last: true,
        };
        const prevValue = this.value_;
        if (prevValue === value && !opts.forceEmit) {
            return;
        }
        this.emitter.emit('beforechange', {
            sender: this,
        });
        this.value_ = value;
        this.emitter.emit('change', {
            options: opts,
            previousRawValue: prevValue,
            rawValue: this.value_,
            sender: this,
        });
    }
}
