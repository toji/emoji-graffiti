import { ViewProps } from '../../../common/model/view-props.js';
import { View } from '../../../common/view/view.js';
interface Config {
    viewProps: ViewProps;
}
/**
 * @hidden
 */
export declare class TabPageView implements View {
    readonly element: HTMLElement;
    readonly containerElement: HTMLElement;
    constructor(doc: Document, config: Config);
}
export {};
