import { createNumberFormatter, numberFromUnknown, } from '../../common/converter/number.js';
import { parseRecord } from '../../common/micro-parsers.js';
import { ValueMap } from '../../common/model/value-map.js';
import { Constants } from '../../misc/constants.js';
import { isEmpty } from '../../misc/type-util.js';
import { createPlugin } from '../../plugin/plugin.js';
import { MultiLogController } from '../common/controller/multi-log.js';
import { SingleLogController } from '../common/controller/single-log.js';
import { GraphLogMonitorBindingApi } from './api/graph-log.js';
import { GraphLogController } from './controller/graph-log.js';
function createFormatter(params) {
    return !isEmpty(params.format) ? params.format : createNumberFormatter(2);
}
function createTextMonitor(args) {
    var _a;
    if (args.value.rawValue.length === 1) {
        return new SingleLogController(args.document, {
            formatter: createFormatter(args.params),
            value: args.value,
            viewProps: args.viewProps,
        });
    }
    return new MultiLogController(args.document, {
        formatter: createFormatter(args.params),
        rows: (_a = args.params.rows) !== null && _a !== void 0 ? _a : Constants.monitor.defaultRows,
        value: args.value,
        viewProps: args.viewProps,
    });
}
function createGraphMonitor(args) {
    var _a, _b, _c;
    return new GraphLogController(args.document, {
        formatter: createFormatter(args.params),
        rows: (_a = args.params.rows) !== null && _a !== void 0 ? _a : Constants.monitor.defaultRows,
        props: ValueMap.fromObject({
            max: (_b = args.params.max) !== null && _b !== void 0 ? _b : 100,
            min: (_c = args.params.min) !== null && _c !== void 0 ? _c : 0,
        }),
        value: args.value,
        viewProps: args.viewProps,
    });
}
function shouldShowGraph(params) {
    return params.view === 'graph';
}
/**
 * @hidden
 */
export const NumberMonitorPlugin = createPlugin({
    id: 'monitor-number',
    type: 'monitor',
    accept: (value, params) => {
        if (typeof value !== 'number') {
            return null;
        }
        const result = parseRecord(params, (p) => ({
            format: p.optional.function,
            max: p.optional.number,
            min: p.optional.number,
            readonly: p.required.constant(true),
            rows: p.optional.number,
            view: p.optional.string,
        }));
        return result
            ? {
                initialValue: value,
                params: result,
            }
            : null;
    },
    binding: {
        defaultBufferSize: (params) => (shouldShowGraph(params) ? 64 : 1),
        reader: (_args) => numberFromUnknown,
    },
    controller: (args) => {
        if (shouldShowGraph(args.params)) {
            return createGraphMonitor(args);
        }
        return createTextMonitor(args);
    },
    api: (args) => {
        if (args.controller.valueController instanceof GraphLogController) {
            return new GraphLogMonitorBindingApi(args.controller);
        }
        return null;
    },
});
