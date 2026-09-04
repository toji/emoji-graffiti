import { BladeState, PropsPortable } from '../../../blade/common/controller/blade-state.js';
import { Blade } from '../../../blade/common/model/blade.js';
import { Controller } from '../../controller/controller.js';
import { ViewProps } from '../../model/view-props.js';
import { LabelProps, LabelView } from '../view/label.js';
/**
 * @hidden
 */
interface Config<C extends Controller> {
    blade: Blade;
    props: LabelProps;
    valueController: C;
}
/**
 * @hidden
 */
export declare class LabelController<C extends Controller> implements Controller<LabelView>, PropsPortable {
    readonly props: LabelProps;
    readonly valueController: C;
    readonly view: LabelView;
    readonly viewProps: ViewProps;
    constructor(doc: Document, config: Config<C>);
    importProps(state: BladeState): boolean;
    exportProps(): BladeState;
}
export {};
