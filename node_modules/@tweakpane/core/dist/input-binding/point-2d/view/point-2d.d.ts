import { Value } from '../../../common/model/value.js';
import { ViewProps } from '../../../common/model/view-props.js';
import { PickerLayout } from '../../../common/params.js';
import { View } from '../../../common/view/view.js';
interface Config {
    expanded: Value<boolean>;
    pickerLayout: PickerLayout;
    viewProps: ViewProps;
}
/**
 * @hidden
 */
export declare class Point2dView implements View {
    readonly element: HTMLElement;
    readonly buttonElement: HTMLButtonElement;
    readonly textElement: HTMLElement;
    readonly pickerElement: HTMLElement | null;
    constructor(doc: Document, config: Config);
}
export {};
