import { Value } from '../model/value.js';
import { ViewProps } from '../model/view-props.js';
import { PopupView } from '../view/popup.js';
import { Controller } from './controller.js';
interface Config {
    viewProps: ViewProps;
}
export declare class PopupController implements Controller<PopupView> {
    readonly shows: Value<boolean>;
    readonly view: PopupView;
    readonly viewProps: ViewProps;
    constructor(doc: Document, config: Config);
}
export {};
