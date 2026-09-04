import { ValueMap } from '../../../common/model/value-map.js';
import { ViewProps } from '../../../common/model/view-props.js';
import { View } from '../../../common/view/view.js';
/**
 * @hidden
 */
export type ButtonPropsObject = {
    title: string | undefined;
};
/**
 * @hidden
 */
export type ButtonProps = ValueMap<ButtonPropsObject>;
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
export declare class ButtonView implements View {
    readonly element: HTMLElement;
    readonly buttonElement: HTMLButtonElement;
    constructor(doc: Document, config: Config);
}
export {};
