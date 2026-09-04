import { ListInputBindingApi } from '../../common/api/list.js';
import { CompositeConstraint, findConstraint, } from '../../common/constraint/composite.js';
import { ListConstraint } from '../../common/constraint/list.js';
import { ListController } from '../../common/controller/list.js';
import { boolFromUnknown } from '../../common/converter/boolean.js';
import { createListConstraint, parseListOptions, } from '../../common/list-util.js';
import { parseRecord } from '../../common/micro-parsers.js';
import { ValueMap } from '../../common/model/value-map.js';
import { writePrimitive } from '../../common/primitive.js';
import { createPlugin } from '../../plugin/plugin.js';
import { CheckboxController } from './controller/checkbox.js';
function createConstraint(params) {
    const constraints = [];
    const lc = createListConstraint(params.options);
    if (lc) {
        constraints.push(lc);
    }
    return new CompositeConstraint(constraints);
}
/**
 * @hidden
 */
export const BooleanInputPlugin = createPlugin({
    id: 'input-bool',
    type: 'input',
    accept: (value, params) => {
        if (typeof value !== 'boolean') {
            return null;
        }
        const result = parseRecord(params, (p) => ({
            options: p.optional.custom(parseListOptions),
            readonly: p.optional.constant(false),
        }));
        return result
            ? {
                initialValue: value,
                params: result,
            }
            : null;
    },
    binding: {
        reader: (_args) => boolFromUnknown,
        constraint: (args) => createConstraint(args.params),
        writer: (_args) => writePrimitive,
    },
    controller: (args) => {
        const doc = args.document;
        const value = args.value;
        const c = args.constraint;
        const lc = c && findConstraint(c, ListConstraint);
        if (lc) {
            return new ListController(doc, {
                props: new ValueMap({
                    options: lc.values.value('options'),
                }),
                value: value,
                viewProps: args.viewProps,
            });
        }
        return new CheckboxController(doc, {
            value: value,
            viewProps: args.viewProps,
        });
    },
    api(args) {
        if (typeof args.controller.value.rawValue !== 'boolean') {
            return null;
        }
        if (args.controller.valueController instanceof ListController) {
            return new ListInputBindingApi(args.controller);
        }
        return null;
    },
});
