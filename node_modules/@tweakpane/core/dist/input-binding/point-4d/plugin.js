import { parseNumber } from '../../common/converter/number.js';
import { parseRecord } from '../../common/micro-parsers.js';
import { createPointAxis } from '../../common/point-nd/point-axis.js';
import { createDimensionConstraint, createPointDimensionParser, parsePointDimensionParams, } from '../../common/point-nd/util.js';
import { deepMerge } from '../../misc/type-util.js';
import { createPlugin } from '../../plugin/plugin.js';
import { PointNdConstraint } from '../common/constraint/point-nd.js';
import { PointNdTextController } from '../common/controller/point-nd-text.js';
import { point4dFromUnknown, writePoint4d } from './converter/point-4d.js';
import { Point4d, Point4dAssembly } from './model/point-4d.js';
function createConstraint(params, initialValue) {
    return new PointNdConstraint({
        assembly: Point4dAssembly,
        components: [
            createDimensionConstraint(Object.assign(Object.assign({}, params), params.x), initialValue.x),
            createDimensionConstraint(Object.assign(Object.assign({}, params), params.y), initialValue.y),
            createDimensionConstraint(Object.assign(Object.assign({}, params), params.z), initialValue.z),
            createDimensionConstraint(Object.assign(Object.assign({}, params), params.w), initialValue.w),
        ],
    });
}
/**
 * @hidden
 */
export const Point4dInputPlugin = createPlugin({
    id: 'input-point4d',
    type: 'input',
    accept: (value, params) => {
        if (!Point4d.isObject(value)) {
            return null;
        }
        const result = parseRecord(params, (p) => (Object.assign(Object.assign({}, createPointDimensionParser(p)), { readonly: p.optional.constant(false), w: p.optional.custom(parsePointDimensionParams), x: p.optional.custom(parsePointDimensionParams), y: p.optional.custom(parsePointDimensionParams), z: p.optional.custom(parsePointDimensionParams) })));
        return result
            ? {
                initialValue: value,
                params: result,
            }
            : null;
    },
    binding: {
        reader: (_args) => point4dFromUnknown,
        constraint: (args) => createConstraint(args.params, args.initialValue),
        equals: Point4d.equals,
        writer: (_args) => writePoint4d,
    },
    controller: (args) => {
        const value = args.value;
        const c = args.constraint;
        const dParams = [
            args.params.x,
            args.params.y,
            args.params.z,
            args.params.w,
        ];
        return new PointNdTextController(args.document, {
            assembly: Point4dAssembly,
            axes: value.rawValue.getComponents().map((comp, i) => {
                var _a;
                return createPointAxis({
                    constraint: c.components[i],
                    initialValue: comp,
                    params: deepMerge(args.params, ((_a = dParams[i]) !== null && _a !== void 0 ? _a : {})),
                });
            }),
            parser: parseNumber,
            value: value,
            viewProps: args.viewProps,
        });
    },
});
