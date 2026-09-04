import { Controller } from '../../../common/controller/controller.js';
import { Emitter } from '../../../common/model/emitter.js';
import { ViewProps } from '../../../common/model/view-props.js';
import { BladeState, PropsPortable } from '../../common/controller/blade-state.js';
import { ButtonProps, ButtonView } from '../view/button.js';
/**
 * @hidden
 */
export interface ButtonEvents {
    click: {
        nativeEvent: MouseEvent;
        sender: ButtonController;
    };
}
/**
 * @hidden
 */
interface Config {
    props: ButtonProps;
    viewProps: ViewProps;
}
/**
 * @hidden
 */
export declare class ButtonController implements Controller<ButtonView>, PropsPortable {
    readonly emitter: Emitter<ButtonEvents>;
    readonly props: ButtonProps;
    readonly view: ButtonView;
    readonly viewProps: ViewProps;
    /**
     * @hidden
     */
    constructor(doc: Document, config: Config);
    importProps(state: BladeState): boolean;
    exportProps(): BladeState;
    private onClick_;
}
export {};
