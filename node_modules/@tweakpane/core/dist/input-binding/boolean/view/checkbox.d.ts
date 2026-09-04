import { Value } from '../../../common/model/value.js';
import { ViewProps } from '../../../common/model/view-props.js';
import { View } from '../../../common/view/view.js';
interface Config {
    value: Value<boolean>;
    viewProps: ViewProps;
}
/**
 * @hidden
 */
export declare class CheckboxView implements View {
    readonly element: HTMLElement;
    readonly inputElement: HTMLInputElement;
    readonly labelElement: HTMLLabelElement;
    readonly value: Value<boolean>;
    constructor(doc: Document, config: Config);
    private update_;
    private onValueChange_;
}
export {};
