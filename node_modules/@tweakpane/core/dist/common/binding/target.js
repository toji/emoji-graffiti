import { TpError } from '../tp-error.js';
/**
 * A binding target.
 */
export class BindingTarget {
    /**
     * @hidden
     */
    constructor(obj, key) {
        this.obj_ = obj;
        this.key = key;
    }
    static isBindable(obj) {
        if (obj === null) {
            return false;
        }
        if (typeof obj !== 'object' && typeof obj !== 'function') {
            return false;
        }
        return true;
    }
    /**
     * Read a bound value.
     * @return A bound value
     */
    read() {
        return this.obj_[this.key];
    }
    /**
     * Write a value.
     * @param value The value to write to the target.
     */
    write(value) {
        this.obj_[this.key] = value;
    }
    /**
     * Write a value to the target property.
     * @param name The property name.
     * @param value The value to write to the target.
     */
    writeProperty(name, value) {
        const valueObj = this.read();
        if (!BindingTarget.isBindable(valueObj)) {
            throw TpError.notBindable();
        }
        if (!(name in valueObj)) {
            throw TpError.propertyNotFound(name);
        }
        valueObj[name] = value;
    }
}
