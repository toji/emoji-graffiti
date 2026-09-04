import { isEmpty } from '../../../misc/type-util.js';
function isRgbColorComponent(obj, key) {
    if (typeof obj !== 'object' || isEmpty(obj)) {
        return false;
    }
    return key in obj && typeof obj[key] === 'number';
}
export function isRgbColorObject(obj) {
    return (isRgbColorComponent(obj, 'r') &&
        isRgbColorComponent(obj, 'g') &&
        isRgbColorComponent(obj, 'b'));
}
export function isRgbaColorObject(obj) {
    return isRgbColorObject(obj) && isRgbColorComponent(obj, 'a');
}
export function isColorObject(obj) {
    return isRgbColorObject(obj);
}
export function equalsColor(v1, v2) {
    if (v1.mode !== v2.mode) {
        return false;
    }
    if (v1.type !== v2.type) {
        return false;
    }
    const comps1 = v1.getComponents();
    const comps2 = v2.getComponents();
    for (let i = 0; i < comps1.length; i++) {
        if (comps1[i] !== comps2[i]) {
            return false;
        }
    }
    return true;
}
export function createColorComponentsFromRgbObject(obj) {
    return 'a' in obj ? [obj.r, obj.g, obj.b, obj.a] : [obj.r, obj.g, obj.b];
}
