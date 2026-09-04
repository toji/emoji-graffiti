import { ViewProps } from '../model/view-props.js';
import { View } from './view.js';
/**
 * @hidden
 */
interface Config {
    viewName: string;
    viewProps: ViewProps;
}
/**
 * @hidden
 */
export declare class PlainView implements View {
    readonly element: HTMLElement;
    /**
     * @hidden
     */
    constructor(doc: Document, config: Config);
}
export {};
