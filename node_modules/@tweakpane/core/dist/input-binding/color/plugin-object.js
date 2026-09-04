import { createPlugin } from '../../plugin/plugin.js';
import { ColorController } from './controller/color.js';
import { colorFromObject } from './converter/color-object.js';
import { colorToObjectRgbaString, colorToObjectRgbString, createColorStringParser, } from './converter/color-string.js';
import { createColorObjectWriter } from './converter/writer.js';
import { equalsColor, isColorObject, isRgbaColorObject, } from './model/color.js';
import { mapColorType } from './model/colors.js';
import { extractColorType, parseColorInputParams } from './util.js';
function shouldSupportAlpha(initialValue) {
    return isRgbaColorObject(initialValue);
}
function createColorObjectBindingReader(type) {
    return (value) => {
        const c = colorFromObject(value, type);
        return mapColorType(c, 'int');
    };
}
function createColorObjectFormatter(supportsAlpha, type) {
    return (value) => {
        if (supportsAlpha) {
            return colorToObjectRgbaString(value, type);
        }
        return colorToObjectRgbString(value, type);
    };
}
/**
 * @hidden
 */
export const ObjectColorInputPlugin = createPlugin({
    id: 'input-color-object',
    type: 'input',
    accept: (value, params) => {
        var _a;
        if (!isColorObject(value)) {
            return null;
        }
        const result = parseColorInputParams(params);
        return result
            ? {
                initialValue: value,
                params: Object.assign(Object.assign({}, result), { colorType: (_a = extractColorType(params)) !== null && _a !== void 0 ? _a : 'int' }),
            }
            : null;
    },
    binding: {
        reader: (args) => createColorObjectBindingReader(args.params.colorType),
        equals: equalsColor,
        writer: (args) => createColorObjectWriter(shouldSupportAlpha(args.initialValue), args.params.colorType),
    },
    controller: (args) => {
        var _a, _b;
        const supportsAlpha = isRgbaColorObject(args.initialValue);
        return new ColorController(args.document, {
            colorType: args.params.colorType,
            expanded: (_a = args.params.expanded) !== null && _a !== void 0 ? _a : false,
            formatter: createColorObjectFormatter(supportsAlpha, args.params.colorType),
            parser: createColorStringParser('int'),
            pickerLayout: (_b = args.params.picker) !== null && _b !== void 0 ? _b : 'popup',
            supportsAlpha: supportsAlpha,
            value: args.value,
            viewProps: args.viewProps,
        });
    },
});
