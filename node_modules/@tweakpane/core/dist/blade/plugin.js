import { parseRecord } from '../common/micro-parsers.js';
import { ViewProps } from '../common/model/view-props.js';
import { forceCast } from '../misc/type-util.js';
import { createBlade } from './common/model/blade.js';
export function createBladeController(plugin, args) {
    const ac = plugin.accept(args.params);
    if (!ac) {
        return null;
    }
    const params = parseRecord(args.params, (p) => ({
        disabled: p.optional.boolean,
        hidden: p.optional.boolean,
    }));
    return plugin.controller({
        blade: createBlade(),
        document: args.document,
        params: forceCast(Object.assign(Object.assign({}, ac.params), { disabled: params === null || params === void 0 ? void 0 : params.disabled, hidden: params === null || params === void 0 ? void 0 : params.hidden })),
        viewProps: ViewProps.create({
            disabled: params === null || params === void 0 ? void 0 : params.disabled,
            hidden: params === null || params === void 0 ? void 0 : params.hidden,
        }),
    });
}
