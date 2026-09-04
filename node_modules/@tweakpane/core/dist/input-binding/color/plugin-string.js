import { TpError } from '../../common/tp-error.js';
import { createPlugin } from '../../plugin/plugin.js';
import { ColorController } from './controller/color.js';
import { createColorStringParser, detectStringColorFormat, findColorStringifier, readIntColorString, } from './converter/color-string.js';
import { createColorStringWriter } from './converter/writer.js';
import { equalsColor } from './model/color.js';
import { extractColorType, parseColorInputParams } from './util.js';
/**
 * @hidden
 */
export const StringColorInputPlugin = createPlugin({
    id: 'input-color-string',
    type: 'input',
    accept: (value, params) => {
        if (typeof value !== 'string') {
            return null;
        }
        if (params.view === 'text') {
            return null;
        }
        const format = detectStringColorFormat(value, extractColorType(params));
        if (!format) {
            return null;
        }
        const stringifier = findColorStringifier(format);
        if (!stringifier) {
            return null;
        }
        const result = parseColorInputParams(params);
        return result
            ? {
                initialValue: value,
                params: Object.assign(Object.assign({}, result), { format: format, stringifier: stringifier }),
            }
            : null;
    },
    binding: {
        reader: () => readIntColorString,
        equals: equalsColor,
        writer: (args) => {
            const writer = createColorStringWriter(args.params.format);
            if (!writer) {
                throw TpError.notBindable();
            }
            return writer;
        },
    },
    controller: (args) => {
        var _a, _b;
        return new ColorController(args.document, {
            colorType: args.params.format.type,
            expanded: (_a = args.params.expanded) !== null && _a !== void 0 ? _a : false,
            formatter: args.params.stringifier,
            parser: createColorStringParser('int'),
            pickerLayout: (_b = args.params.picker) !== null && _b !== void 0 ? _b : 'popup',
            supportsAlpha: args.params.format.alpha,
            value: args.value,
            viewProps: args.viewProps,
        });
    },
});
