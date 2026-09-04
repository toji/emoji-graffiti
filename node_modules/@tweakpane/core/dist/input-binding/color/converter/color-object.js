import { createColorComponentsFromRgbObject, isColorObject, } from '../model/color.js';
import { mapColorType } from '../model/colors.js';
import { FloatColor } from '../model/float-color.js';
import { IntColor } from '../model/int-color.js';
export function colorFromObject(value, type) {
    if (!isColorObject(value)) {
        return mapColorType(IntColor.black(), type);
    }
    if (type === 'int') {
        const comps = createColorComponentsFromRgbObject(value);
        return new IntColor(comps, 'rgb');
    }
    if (type === 'float') {
        const comps = createColorComponentsFromRgbObject(value);
        return new FloatColor(comps, 'rgb');
    }
    return mapColorType(IntColor.black(), 'int');
}
