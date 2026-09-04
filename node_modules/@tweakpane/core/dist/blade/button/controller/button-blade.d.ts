import { LabelController } from '../../../common/label/controller/label.js';
import { LabelProps, LabelView } from '../../../common/label/view/label.js';
import { ViewProps } from '../../../common/model/view-props.js';
import { BladeController } from '../../common/controller/blade.js';
import { BladeState } from '../../common/controller/blade-state.js';
import { Blade } from '../../common/model/blade.js';
import { ButtonProps } from '../view/button.js';
import { ButtonController } from './button.js';
/**
 * @hidden
 */
interface Config {
    blade: Blade;
    buttonProps: ButtonProps;
    labelProps: LabelProps;
    viewProps: ViewProps;
}
export declare class ButtonBladeController extends BladeController<LabelView> {
    readonly buttonController: ButtonController;
    readonly labelController: LabelController<ButtonController>;
    constructor(doc: Document, config: Config);
    importState(state: BladeState): boolean;
    exportState(): BladeState;
}
export {};
