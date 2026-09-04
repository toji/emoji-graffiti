import { parseRecord } from '../../common/micro-parsers.js';
import { ValueMap } from '../../common/model/value-map.js';
import { createPlugin } from '../../plugin/plugin.js';
import { ButtonApi } from './api/button.js';
import { ButtonBladeController } from './controller/button-blade.js';
export const ButtonBladePlugin = createPlugin({
    id: 'button',
    type: 'blade',
    accept(params) {
        const result = parseRecord(params, (p) => ({
            title: p.required.string,
            view: p.required.constant('button'),
            label: p.optional.string,
        }));
        return result ? { params: result } : null;
    },
    controller(args) {
        return new ButtonBladeController(args.document, {
            blade: args.blade,
            buttonProps: ValueMap.fromObject({
                title: args.params.title,
            }),
            labelProps: ValueMap.fromObject({
                label: args.params.label,
            }),
            viewProps: args.viewProps,
        });
    },
    api(args) {
        if (args.controller instanceof ButtonBladeController) {
            return new ButtonApi(args.controller);
        }
        return null;
    },
});
