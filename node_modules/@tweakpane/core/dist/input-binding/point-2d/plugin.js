import { parseNumber } from '../../common/converter/number.js';
import { parseRecord } from '../../common/micro-parsers.js';
import { getSuitableKeyScale } from '../../common/number/util.js';
import { parsePickerLayout } from '../../common/picker-util.js';
import { createPointAxis } from '../../common/point-nd/point-axis.js';
import { createPointDimensionParser } from '../../common/point-nd/util.js';
import { parsePointDimensionParams } from '../../common/point-nd/util.js';
import { createDimensionConstraint } from '../../common/point-nd/util.js';
import { deepMerge, isEmpty } from '../../misc/type-util.js';
import { createPlugin } from '../../plugin/plugin.js';
import { PointNdConstraint } from '../common/constraint/point-nd.js';
import { Point2dController } from './controller/point-2d.js';
import { point2dFromUnknown, writePoint2d } from './converter/point-2d.js';
import { Point2d, Point2dAssembly } from './model/point-2d.js';
function createConstraint(params, initialValue) {
    return new PointNdConstraint({
        assembly: Point2dAssembly,
        components: [
            createDimensionConstraint(Object.assign(Object.assign({}, params), params.x), initialValue.x),
            createDimensionConstraint(Object.assign(Object.assign({}, params), params.y), initialValue.y),
        ],
    });
}
function getSuitableMaxDimensionValue(params, rawValue) {
    var _a, _b;
    if (!isEmpty(params.min) || !isEmpty(params.max)) {
        return Math.max(Math.abs((_a = params.min) !== null && _a !== void 0 ? _a : 0), Math.abs((_b = params.max) !== null && _b !== void 0 ? _b : 0));
    }
    const step = getSuitableKeyScale(params);
    return Math.max(Math.abs(step) * 10, Math.abs(rawValue) * 10);
}
export function getSuitableMax(params, initialValue) {
    var _a, _b;
    const xr = getSuitableMaxDimensionValue(deepMerge(params, ((_a = params.x) !== null && _a !== void 0 ? _a : {})), initialValue.x);
    const yr = getSuitableMaxDimensionValue(deepMerge(params, ((_b = params.y) !== null && _b !== void 0 ? _b : {})), initialValue.y);
    return Math.max(xr, yr);
}
function shouldInvertY(params) {
    if (!('y' in params)) {
        return false;
    }
    const yParams = params.y;
    if (!yParams) {
        return false;
    }
    return 'inverted' in yParams ? !!yParams.inverted : false;
}
/**
 * @hidden
 */
export const Point2dInputPlugin = createPlugin({
    id: 'input-point2d',
    type: 'input',
    accept: (value, params) => {
        if (!Point2d.isObject(value)) {
            return null;
        }
        const result = parseRecord(params, (p) => (Object.assign(Object.assign({}, createPointDimensionParser(p)), { expanded: p.optional.boolean, picker: p.optional.custom(parsePickerLayout), readonly: p.optional.constant(false), x: p.optional.custom(parsePointDimensionParams), y: p.optional.object(Object.assign(Object.assign({}, createPointDimensionParser(p)), { inverted: p.optional.boolean })) })));
        return result
            ? {
                initialValue: value,
                params: result,
            }
            : null;
    },
    binding: {
        reader: () => point2dFromUnknown,
        constraint: (args) => createConstraint(args.params, args.initialValue),
        equals: Point2d.equals,
        writer: () => writePoint2d,
    },
    controller: (args) => {
        var _a, _b;
        const doc = args.document;
        const value = args.value;
        const c = args.constraint;
        const dParams = [args.params.x, args.params.y];
        return new Point2dController(doc, {
            axes: value.rawValue.getComponents().map((comp, i) => {
                var _a;
                return createPointAxis({
                    constraint: c.components[i],
                    initialValue: comp,
                    params: deepMerge(args.params, ((_a = dParams[i]) !== null && _a !== void 0 ? _a : {})),
                });
            }),
            expanded: (_a = args.params.expanded) !== null && _a !== void 0 ? _a : false,
            invertsY: shouldInvertY(args.params),
            max: getSuitableMax(args.params, value.rawValue),
            parser: parseNumber,
            pickerLayout: (_b = args.params.picker) !== null && _b !== void 0 ? _b : 'popup',
            value: value,
            viewProps: args.viewProps,
        });
    },
});
