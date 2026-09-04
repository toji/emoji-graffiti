import { parseRecord } from '../common/micro-parsers.js';
import { ValueMap } from '../common/model/value-map.js';
import { createValue } from '../common/model/values.js';
import { ViewProps } from '../common/model/view-props.js';
import { TpError } from '../common/tp-error.js';
import { PlainView } from '../common/view/plain.js';
import { CheckboxController } from '../input-binding/boolean/controller/checkbox.js';
import { createDefaultPluginPool } from '../plugin/plugins.js';
import { VERSION } from '../version.js';
import { BladeApi } from './common/api/blade.js';
import { BladeController } from './common/controller/blade.js';
import { exportBladeState, importBladeState, } from './common/controller/blade-state.js';
import { createBlade } from './common/model/blade.js';
import { LabeledValueBladeController } from './label/controller/value.js';
class LabelableController {
    constructor(doc) {
        this.viewProps = ViewProps.create();
        this.view = new PlainView(doc, {
            viewName: '',
            viewProps: this.viewProps,
        });
    }
}
export function createEmptyLabelableController(doc) {
    return new LabelableController(doc);
}
export function createEmptyBladeController(doc) {
    return new BladeController({
        blade: createBlade(),
        view: new PlainView(doc, {
            viewName: '',
            viewProps: ViewProps.create(),
        }),
        viewProps: ViewProps.create(),
    });
}
export class TestValueBladeApi extends BladeApi {
    get value() {
        return this.controller.value.rawValue;
    }
    set value(value) {
        this.controller.value.rawValue = value;
    }
}
export const TestValueBladePlugin = {
    id: 'test',
    type: 'blade',
    core: VERSION,
    accept(params) {
        const r = parseRecord(params, (p) => ({
            view: p.required.constant('test'),
        }));
        return r ? { params: r } : null;
    },
    controller(args) {
        const v = createValue(false);
        return new LabeledValueBladeController(args.document, {
            blade: createBlade(),
            props: ValueMap.fromObject({
                label: '',
            }),
            value: v,
            valueController: new CheckboxController(args.document, {
                value: v,
                viewProps: args.viewProps,
            }),
        });
    },
    api(args) {
        if (!(args.controller instanceof LabeledValueBladeController)) {
            return null;
        }
        const vc = args.controller.valueController;
        if (!(vc instanceof CheckboxController)) {
            return null;
        }
        return new TestValueBladeApi(args.controller);
    },
};
export function createAppropriateBladeController(doc) {
    return TestValueBladePlugin.controller({
        blade: createBlade(),
        document: doc,
        params: {
            view: 'test',
            disabled: false,
            hidden: false,
        },
        viewProps: ViewProps.create(),
    });
}
export function createAppropriateBladeApi(doc) {
    const api = TestValueBladePlugin.api({
        controller: createAppropriateBladeController(doc),
        pool: createDefaultPluginPool(),
    });
    if (!api) {
        throw TpError.shouldNeverHappen();
    }
    return api;
}
export class TestKeyBladeController extends BladeController {
    constructor(doc, key) {
        const viewProps = ViewProps.create();
        const view = new PlainView(doc, {
            viewName: '',
            viewProps: viewProps,
        });
        super({
            blade: createBlade(),
            view: view,
            viewProps: viewProps,
        });
        this.key = key;
    }
    importState(state) {
        return importBladeState(state, (s) => super.importState(s), (p) => ({
            key: p.required.string,
        }), (result) => {
            this.key = String(result.key);
            return true;
        });
    }
    exportState() {
        return exportBladeState(() => super.exportState(), {
            key: this.key,
        });
    }
}
