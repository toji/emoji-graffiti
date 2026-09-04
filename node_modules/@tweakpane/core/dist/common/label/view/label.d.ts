import { ValueMap } from '../../model/value-map.js';
import { ViewProps } from '../../model/view-props.js';
import { View } from '../../view/view.js';
/**
 * @hidden
 */
export type LabelPropsObject = {
    label: string | null | undefined;
};
/**
 * @hidden
 */
export type LabelProps = ValueMap<LabelPropsObject>;
/**
 * @hidden
 */
interface Config {
    props: LabelProps;
    viewProps: ViewProps;
}
/**
 * @hidden
 */
export declare class LabelView implements View {
    readonly element: HTMLElement;
    readonly labelElement: HTMLElement;
    readonly valueElement: HTMLElement;
    constructor(doc: Document, config: Config);
}
export {};
