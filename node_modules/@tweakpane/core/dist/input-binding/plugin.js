import { InputBindingController } from '../blade/binding/controller/input-binding.js';
import { createBlade } from '../blade/common/model/blade.js';
import { ReadWriteBinding } from '../common/binding/read-write.js';
import { InputBindingValue } from '../common/binding/value/input-binding.js';
import { parseRecord } from '../common/micro-parsers.js';
import { ValueMap } from '../common/model/value-map.js';
import { createValue } from '../common/model/values.js';
import { ViewProps } from '../common/model/view-props.js';
import { isEmpty } from '../misc/type-util.js';
export function createInputBindingController(plugin, args) {
    var _a;
    const result = plugin.accept(args.target.read(), args.params);
    if (isEmpty(result)) {
        return null;
    }
    const valueArgs = {
        target: args.target,
        initialValue: result.initialValue,
        params: result.params,
    };
    const params = parseRecord(args.params, (p) => ({
        disabled: p.optional.boolean,
        hidden: p.optional.boolean,
        label: p.optional.string,
        tag: p.optional.string,
    }));
    // Binding and value
    const reader = plugin.binding.reader(valueArgs);
    const constraint = plugin.binding.constraint
        ? plugin.binding.constraint(valueArgs)
        : undefined;
    const binding = new ReadWriteBinding({
        reader: reader,
        target: args.target,
        writer: plugin.binding.writer(valueArgs),
    });
    const value = new InputBindingValue(createValue(reader(result.initialValue), {
        constraint: constraint,
        equals: plugin.binding.equals,
    }), binding);
    // Value controller
    const controller = plugin.controller({
        constraint: constraint,
        document: args.document,
        initialValue: result.initialValue,
        params: result.params,
        value: value,
        viewProps: ViewProps.create({
            disabled: params === null || params === void 0 ? void 0 : params.disabled,
            hidden: params === null || params === void 0 ? void 0 : params.hidden,
        }),
    });
    // Input binding controller
    return new InputBindingController(args.document, {
        blade: createBlade(),
        props: ValueMap.fromObject({
            label: 'label' in args.params ? (_a = params === null || params === void 0 ? void 0 : params.label) !== null && _a !== void 0 ? _a : null : args.target.key,
        }),
        tag: params === null || params === void 0 ? void 0 : params.tag,
        value: value,
        valueController: controller,
    });
}
