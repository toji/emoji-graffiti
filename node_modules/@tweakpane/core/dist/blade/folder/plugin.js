import { parseRecord } from '../../common/micro-parsers.js';
import { ValueMap } from '../../common/model/value-map.js';
import { createPlugin } from '../../plugin/plugin.js';
import { FolderApi } from './api/folder.js';
import { FolderController } from './controller/folder.js';
export const FolderBladePlugin = createPlugin({
    id: 'folder',
    type: 'blade',
    accept(params) {
        const result = parseRecord(params, (p) => ({
            title: p.required.string,
            view: p.required.constant('folder'),
            expanded: p.optional.boolean,
        }));
        return result ? { params: result } : null;
    },
    controller(args) {
        return new FolderController(args.document, {
            blade: args.blade,
            expanded: args.params.expanded,
            props: ValueMap.fromObject({
                title: args.params.title,
            }),
            viewProps: args.viewProps,
        });
    },
    api(args) {
        if (!(args.controller instanceof FolderController)) {
            return null;
        }
        return new FolderApi(args.controller, args.pool);
    },
});
