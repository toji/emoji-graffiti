import { writePrimitive } from '../../../common/primitive.js';
import { colorToRgbaNumber, colorToRgbNumber, } from '../converter/color-number.js';
import { findColorStringifier, } from '../converter/color-string.js';
import { mapColorType } from '../model/colors.js';
export function createColorStringWriter(format) {
    const stringify = findColorStringifier(format);
    return stringify
        ? (target, value) => {
            writePrimitive(target, stringify(value));
        }
        : null;
}
export function createColorNumberWriter(supportsAlpha) {
    const colorToNumber = supportsAlpha ? colorToRgbaNumber : colorToRgbNumber;
    return (target, value) => {
        writePrimitive(target, colorToNumber(value));
    };
}
export function writeRgbaColorObject(target, value, type) {
    const cc = mapColorType(value, type);
    const obj = cc.toRgbaObject();
    target.writeProperty('r', obj.r);
    target.writeProperty('g', obj.g);
    target.writeProperty('b', obj.b);
    target.writeProperty('a', obj.a);
}
export function writeRgbColorObject(target, value, type) {
    const cc = mapColorType(value, type);
    const obj = cc.toRgbaObject();
    target.writeProperty('r', obj.r);
    target.writeProperty('g', obj.g);
    target.writeProperty('b', obj.b);
}
export function createColorObjectWriter(supportsAlpha, type) {
    return (target, inValue) => {
        if (supportsAlpha) {
            writeRgbaColorObject(target, inValue, type);
        }
        else {
            writeRgbColorObject(target, inValue, type);
        }
    };
}
