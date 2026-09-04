import { MonitorBindingController, } from '../blade/binding/controller/monitor-binding.js';
import { createBlade } from '../blade/common/model/blade.js';
import { ReadonlyBinding } from '../common/binding/readonly.js';
import { IntervalTicker } from '../common/binding/ticker/interval.js';
import { ManualTicker } from '../common/binding/ticker/manual.js';
import { MonitorBindingValue } from '../common/binding/value/monitor-binding.js';
import { parseRecord } from '../common/micro-parsers.js';
import { ValueMap } from '../common/model/value-map.js';
import { ViewProps } from '../common/model/view-props.js';
import { Constants } from '../misc/constants.js';
import { isEmpty } from '../misc/type-util.js';
function createTicker(document, interval) {
    return interval === 0
        ? new ManualTicker()
        : new IntervalTicker(document, interval !== null && interval !== void 0 ? interval : Constants.monitor.defaultInterval);
}
export function createMonitorBindingController(plugin, args) {
    var _a, _b, _c;
    const result = plugin.accept(args.target.read(), args.params);
    if (isEmpty(result)) {
        return null;
    }
    const bindingArgs = {
        target: args.target,
        initialValue: result.initialValue,
        params: result.params,
    };
    const params = parseRecord(args.params, (p) => ({
        bufferSize: p.optional.number,
        disabled: p.optional.boolean,
        hidden: p.optional.boolean,
        interval: p.optional.number,
        label: p.optional.string,
    }));
    // Binding and value
    const reader = plugin.binding.reader(bindingArgs);
    const bufferSize = (_b = (_a = params === null || params === void 0 ? void 0 : params.bufferSize) !== null && _a !== void 0 ? _a : (plugin.binding.defaultBufferSize &&
        plugin.binding.defaultBufferSize(result.params))) !== null && _b !== void 0 ? _b : 1;
    const value = new MonitorBindingValue({
        binding: new ReadonlyBinding({
            reader: reader,
            target: args.target,
        }),
        bufferSize: bufferSize,
        ticker: createTicker(args.document, params === null || params === void 0 ? void 0 : params.interval),
    });
    // Value controller
    const controller = plugin.controller({
        document: args.document,
        params: result.params,
        value: value,
        viewProps: ViewProps.create({
            disabled: params === null || params === void 0 ? void 0 : params.disabled,
            hidden: params === null || params === void 0 ? void 0 : params.hidden,
        }),
    });
    controller.viewProps.bindDisabled(value.ticker);
    controller.viewProps.handleDispose(() => {
        value.ticker.dispose();
    });
    // Monitor binding controller
    return new MonitorBindingController(args.document, {
        blade: createBlade(),
        props: ValueMap.fromObject({
            label: 'label' in args.params ? (_c = params === null || params === void 0 ? void 0 : params.label) !== null && _c !== void 0 ? _c : null : args.target.key,
        }),
        value: value,
        valueController: controller,
    });
}
