import { ListInputBindingApi } from '../../common/api/list.js';
import { CompositeConstraint, findConstraint, } from '../../common/constraint/composite.js';
import { DefiniteRangeConstraint } from '../../common/constraint/definite-range.js';
import { ListConstraint } from '../../common/constraint/list.js';
import { ListController } from '../../common/controller/list.js';
import { numberFromUnknown, parseNumber } from '../../common/converter/number.js';
import { createListConstraint, parseListOptions, } from '../../common/list-util.js';
import { parseRecord } from '../../common/micro-parsers.js';
import { ValueMap } from '../../common/model/value-map.js';
import { createValue } from '../../common/model/values.js';
import { NumberTextController } from '../../common/number/controller/number-text.js';
import { createSliderTextProps, SliderTextController, } from '../../common/number/controller/slider-text.js';
import { createNumberTextInputParamsParser, createNumberTextPropsObject, createRangeConstraint, createStepConstraint, } from '../../common/number/util.js';
import { writePrimitive } from '../../common/primitive.js';
import { createPlugin } from '../../plugin/plugin.js';
import { SliderInputBindingApi } from './api/slider.js';
function createConstraint(params, initialValue) {
    const constraints = [];
    const sc = createStepConstraint(params, initialValue);
    if (sc) {
        constraints.push(sc);
    }
    const rc = createRangeConstraint(params);
    if (rc) {
        constraints.push(rc);
    }
    const lc = createListConstraint(params.options);
    if (lc) {
        constraints.push(lc);
    }
    return new CompositeConstraint(constraints);
}
/**
 * @hidden
 */
export const NumberInputPlugin = createPlugin({
    id: 'input-number',
    type: 'input',
    accept: (value, params) => {
        if (typeof value !== 'number') {
            return null;
        }
        const result = parseRecord(params, (p) => (Object.assign(Object.assign({}, createNumberTextInputParamsParser(p)), { options: p.optional.custom(parseListOptions), readonly: p.optional.constant(false) })));
        return result
            ? {
                initialValue: value,
                params: result,
            }
            : null;
    },
    binding: {
        reader: (_args) => numberFromUnknown,
        constraint: (args) => createConstraint(args.params, args.initialValue),
        writer: (_args) => writePrimitive,
    },
    controller: (args) => {
        const value = args.value;
        const c = args.constraint;
        const lc = c && findConstraint(c, ListConstraint);
        if (lc) {
            return new ListController(args.document, {
                props: new ValueMap({
                    options: lc.values.value('options'),
                }),
                value: value,
                viewProps: args.viewProps,
            });
        }
        const textPropsObj = createNumberTextPropsObject(args.params, value.rawValue);
        const drc = c && findConstraint(c, DefiniteRangeConstraint);
        if (drc) {
            return new SliderTextController(args.document, Object.assign(Object.assign({}, createSliderTextProps(Object.assign(Object.assign({}, textPropsObj), { keyScale: createValue(textPropsObj.keyScale), max: drc.values.value('max'), min: drc.values.value('min') }))), { parser: parseNumber, value: value, viewProps: args.viewProps }));
        }
        return new NumberTextController(args.document, {
            parser: parseNumber,
            props: ValueMap.fromObject(textPropsObj),
            value: value,
            viewProps: args.viewProps,
        });
    },
    api(args) {
        if (typeof args.controller.value.rawValue !== 'number') {
            return null;
        }
        if (args.controller.valueController instanceof SliderTextController) {
            return new SliderInputBindingApi(args.controller);
        }
        if (args.controller.valueController instanceof ListController) {
            return new ListInputBindingApi(args.controller);
        }
        return null;
    },
});
