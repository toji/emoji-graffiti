import { mapRange } from '../../../common/number/util.js';
import { TpError } from '../../../common/tp-error.js';
import { getColorMaxComponents, } from './color-model.js';
import { FloatColor } from './float-color.js';
import { IntColor } from './int-color.js';
const TYPE_TO_CONSTRUCTOR_MAP = {
    int: (comps, mode) => new IntColor(comps, mode),
    float: (comps, mode) => new FloatColor(comps, mode),
};
export function createColor(comps, mode, type) {
    return TYPE_TO_CONSTRUCTOR_MAP[type](comps, mode);
}
function isFloatColor(c) {
    return c.type === 'float';
}
function isIntColor(c) {
    return c.type === 'int';
}
function convertFloatToInt(cf) {
    const comps = cf.getComponents();
    const ms = getColorMaxComponents(cf.mode, 'int');
    return new IntColor([
        Math.round(mapRange(comps[0], 0, 1, 0, ms[0])),
        Math.round(mapRange(comps[1], 0, 1, 0, ms[1])),
        Math.round(mapRange(comps[2], 0, 1, 0, ms[2])),
        comps[3],
    ], cf.mode);
}
function convertIntToFloat(ci) {
    const comps = ci.getComponents();
    const ms = getColorMaxComponents(ci.mode, 'int');
    return new FloatColor([
        mapRange(comps[0], 0, ms[0], 0, 1),
        mapRange(comps[1], 0, ms[1], 0, 1),
        mapRange(comps[2], 0, ms[2], 0, 1),
        comps[3],
    ], ci.mode);
}
export function mapColorType(c, type) {
    if (c.type === type) {
        return c;
    }
    if (isIntColor(c) && type === 'float') {
        return convertIntToFloat(c);
    }
    /* istanbul ignore else */
    if (isFloatColor(c) && type === 'int') {
        return convertFloatToInt(c);
    }
    /* istanbul ignore next */
    throw TpError.shouldNeverHappen();
}
