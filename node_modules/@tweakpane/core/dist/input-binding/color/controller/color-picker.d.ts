import { ValueController } from '../../../common/controller/value.js';
import { Value } from '../../../common/model/value.js';
import { ViewProps } from '../../../common/model/view-props.js';
import { ColorType } from '../model/color-model.js';
import { IntColor } from '../model/int-color.js';
import { ColorPickerView } from '../view/color-picker.js';
import { ColorTextsController } from './color-texts.js';
interface Config {
    colorType: ColorType;
    supportsAlpha: boolean;
    value: Value<IntColor>;
    viewProps: ViewProps;
}
/**
 * @hidden
 */
export declare class ColorPickerController implements ValueController<IntColor, ColorPickerView> {
    readonly value: Value<IntColor>;
    readonly view: ColorPickerView;
    readonly viewProps: ViewProps;
    private readonly alphaIcs_;
    private readonly hPaletteC_;
    private readonly svPaletteC_;
    private readonly textsC_;
    constructor(doc: Document, config: Config);
    get textsController(): ColorTextsController;
}
export {};
