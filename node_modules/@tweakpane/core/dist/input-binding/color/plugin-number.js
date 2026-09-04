import { createPlugin } from '../../plugin/plugin.js';
import { ColorController } from './controller/color.js';
import { colorFromRgbaNumber, colorFromRgbNumber, } from './converter/color-number.js';
import { colorToHexRgbaString, colorToHexRgbString, createColorStringParser, } from './converter/color-string.js';
import { createColorNumberWriter } from './converter/writer.js';
import { equalsColor } from './model/color.js';
import { parseColorInputParams } from './util.js';
function shouldSupportAlpha(inputParams) {
    var _a;
    if ((_a = inputParams === null || inputParams === void 0 ? void 0 : inputParams.color) === null || _a === void 0 ? void 0 : _a.alpha) {
        return true;
    }
    return false;
}
function createFormatter(supportsAlpha) {
    return supportsAlpha
        ? (v) => colorToHexRgbaString(v, '0x')
        : (v) => colorToHexRgbString(v, '0x');
}
function isForColor(params) {
    if ('color' in params) {
        return true;
    }
    if (params.view === 'color') {
        return true;
    }
    return false;
}
/**
 * @hidden
 */
export const NumberColorInputPlugin = createPlugin({
    id: 'input-color-number',
    type: 'input',
    accept: (value, params) => {
        if (typeof value !== 'number') {
            return null;
        }
        if (!isForColor(params)) {
            return null;
        }
        const result = parseColorInputParams(params);
        return result
            ? {
                initialValue: value,
                params: Object.assign(Object.assign({}, result), { supportsAlpha: shouldSupportAlpha(params) }),
            }
            : null;
    },
    binding: {
        reader: (args) => {
            return args.params.supportsAlpha
                ? colorFromRgbaNumber
                : colorFromRgbNumber;
        },
        equals: equalsColor,
        writer: (args) => {
            return createColorNumberWriter(args.params.supportsAlpha);
        },
    },
    controller: (args) => {
        var _a, _b;
        return new ColorController(args.document, {
            colorType: 'int',
            expanded: (_a = args.params.expanded) !== null && _a !== void 0 ? _a : false,
            formatter: createFormatter(args.params.supportsAlpha),
            parser: createColorStringParser('int'),
            pickerLayout: (_b = args.params.picker) !== null && _b !== void 0 ? _b : 'popup',
            supportsAlpha: args.params.supportsAlpha,
            value: args.value,
            viewProps: args.viewProps,
        });
    },
});
