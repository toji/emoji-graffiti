import { Value } from '../model/value.js';
import { ViewProps } from '../model/view-props.js';
import { View } from './view.js';
interface Config {
    shows: Value<boolean>;
    viewProps: ViewProps;
}
/**
 * @hidden
 */
export declare class PopupView implements View {
    readonly element: HTMLElement;
    constructor(doc: Document, config: Config);
}
export {};
