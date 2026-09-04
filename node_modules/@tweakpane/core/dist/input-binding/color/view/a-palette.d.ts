import { Value } from '../../../common/model/value.js';
import { ViewProps } from '../../../common/model/view-props.js';
import { View } from '../../../common/view/view.js';
import { IntColor } from '../model/int-color.js';
interface Config {
    value: Value<IntColor>;
    viewProps: ViewProps;
}
/**
 * @hidden
 */
export declare class APaletteView implements View {
    readonly element: HTMLElement;
    readonly value: Value<IntColor>;
    private readonly colorElem_;
    private readonly markerElem_;
    private readonly previewElem_;
    constructor(doc: Document, config: Config);
    private update_;
    private onValueChange_;
}
export {};
