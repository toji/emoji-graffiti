import { forceCast, isEmpty } from '../misc/type-util.js';
import { ListConstraint } from './constraint/list.js';
import { MicroParsers, parseRecord } from './micro-parsers.js';
export function parseListOptions(value) {
    var _a;
    const p = MicroParsers;
    if (Array.isArray(value)) {
        return (_a = parseRecord({ items: value }, (p) => ({
            items: p.required.array(p.required.object({
                text: p.required.string,
                value: p.required.raw,
            })),
        }))) === null || _a === void 0 ? void 0 : _a.items;
    }
    if (typeof value === 'object') {
        return p.required.raw(value)
            .value;
    }
    return undefined;
}
export function normalizeListOptions(options) {
    if (Array.isArray(options)) {
        return options;
    }
    const items = [];
    Object.keys(options).forEach((text) => {
        items.push({ text: text, value: options[text] });
    });
    return items;
}
/**
 * Tries to create a list constraint.
 * @template T The type of the raw value.
 * @param options The list options.
 * @return A constraint or null if not found.
 */
export function createListConstraint(options) {
    return !isEmpty(options)
        ? new ListConstraint(normalizeListOptions(forceCast(options)))
        : null;
}
