import { ValueController } from '../../../common/controller/value.js';
import { Value } from '../../../common/model/value.js';
import { ViewProps } from '../../../common/model/view-props.js';
import { ColorType } from '../model/color-model.js';
import { IntColor } from '../model/int-color.js';
import { ColorTextsMode, ColorTextsView } from '../view/color-texts.js';
interface Config {
    colorType: ColorType;
    value: Value<IntColor>;
    viewProps: ViewProps;
}
/**
 * @hidden
 */
export declare class ColorTextsController implements ValueController<IntColor, ColorTextsView> {
    readonly colorMode: Value<ColorTextsMode>;
    readonly value: Value<IntColor>;
    readonly view: ColorTextsView;
    readonly viewProps: ViewProps;
    private readonly colorType_;
    private ccs_;
    constructor(doc: Document, config: Config);
    private createComponentControllers_;
    private onModeSelectChange_;
}
export {};
