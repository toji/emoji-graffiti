import { ValueController } from '../../../common/controller/value.js';
import { Value } from '../../../common/model/value.js';
import { ViewProps } from '../../../common/model/view-props.js';
import { IntColor } from '../model/int-color.js';
import { ColorSwatchView } from '../view/color-swatch.js';
interface Config {
    value: Value<IntColor>;
    viewProps: ViewProps;
}
/**
 * @hidden
 */
export declare class ColorSwatchController implements ValueController<IntColor, ColorSwatchView> {
    readonly value: Value<IntColor>;
    readonly view: ColorSwatchView;
    readonly viewProps: ViewProps;
    constructor(doc: Document, config: Config);
}
export {};
