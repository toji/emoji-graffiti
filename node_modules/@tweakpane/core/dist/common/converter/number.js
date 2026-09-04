import { isEmpty } from '../../misc/type-util.js';
import { parseEcmaNumberExpression } from './ecma/parser.js';
export function parseNumber(text) {
    var _a;
    const r = parseEcmaNumberExpression(text);
    return (_a = r === null || r === void 0 ? void 0 : r.evaluate()) !== null && _a !== void 0 ? _a : null;
}
export function numberFromUnknown(value) {
    if (typeof value === 'number') {
        return value;
    }
    if (typeof value === 'string') {
        const pv = parseNumber(value);
        if (!isEmpty(pv)) {
            return pv;
        }
    }
    return 0;
}
export function numberToString(value) {
    return String(value);
}
export function createNumberFormatter(digits) {
    return (value) => {
        // toFixed() of Safari doesn't support digits greater than 20
        // https://github.com/cocopon/tweakpane/pull/19
        return value.toFixed(Math.max(Math.min(digits, 20), 0));
    };
}
