import { Value } from '../../../common/model/value.js';
import { ViewProps } from '../../../common/model/view-props.js';
import { View } from '../../../common/view/view.js';
/**
 * @hidden
 */
interface Config {
    empty: Value<boolean>;
    viewProps: ViewProps;
}
/**
 * @hidden
 */
export declare class TabView implements View {
    readonly element: HTMLElement;
    readonly itemsElement: HTMLElement;
    readonly contentsElement: HTMLElement;
    constructor(doc: Document, config: Config);
}
export {};
