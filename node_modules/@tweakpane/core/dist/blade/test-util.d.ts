import { Controller } from '../common/controller/controller.js';
import { ViewProps } from '../common/model/view-props.js';
import { BaseBladeParams } from '../common/params.js';
import { PlainView } from '../common/view/plain.js';
import { CheckboxController } from '../input-binding/boolean/controller/checkbox.js';
import { BladeApi } from './common/api/blade.js';
import { BladeController } from './common/controller/blade.js';
import { BladeState } from './common/controller/blade-state.js';
import { LabeledValueBladeController } from './label/controller/value.js';
import { BladePlugin } from './plugin.js';
declare class LabelableController implements Controller {
    readonly viewProps: ViewProps;
    readonly view: PlainView;
    constructor(doc: Document);
}
export declare function createEmptyLabelableController(doc: Document): LabelableController;
export declare function createEmptyBladeController(doc: Document): BladeController<PlainView>;
export declare class TestValueBladeApi extends BladeApi<LabeledValueBladeController<boolean, CheckboxController>> {
    get value(): boolean;
    set value(value: boolean);
}
interface TestBladeParams extends BaseBladeParams {
    view: 'test';
}
export declare const TestValueBladePlugin: BladePlugin<TestBladeParams>;
export declare function createAppropriateBladeController(doc: Document): BladeController;
export declare function createAppropriateBladeApi(doc: Document): BladeApi;
export declare class TestKeyBladeController extends BladeController {
    key: string;
    constructor(doc: Document, key: string);
    importState(state: BladeState): boolean;
    exportState(): BladeState;
}
export {};
