import { parseRecord } from '../../common/micro-parsers.js';
import { parsePickerLayout } from '../../common/picker-util.js';
function parseColorType(value) {
    return value === 'int' ? 'int' : value === 'float' ? 'float' : undefined;
}
export function parseColorInputParams(params) {
    return parseRecord(params, (p) => ({
        color: p.optional.object({
            alpha: p.optional.boolean,
            type: p.optional.custom(parseColorType),
        }),
        expanded: p.optional.boolean,
        picker: p.optional.custom(parsePickerLayout),
        readonly: p.optional.constant(false),
    }));
}
export function getKeyScaleForColor(forAlpha) {
    return forAlpha ? 0.1 : 1;
}
export function extractColorType(params) {
    var _a;
    return (_a = params.color) === null || _a === void 0 ? void 0 : _a.type;
}
