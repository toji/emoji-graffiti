import { TextController } from '../../../common/controller/text.js';
import { ValueController } from '../../../common/controller/value.js';
import { Formatter } from '../../../common/converter/formatter.js';
import { Parser } from '../../../common/converter/parser.js';
import { Value } from '../../../common/model/value.js';
import { ViewProps } from '../../../common/model/view-props.js';
import { PickerLayout } from '../../../common/params.js';
import { ColorType } from '../model/color-model.js';
import { IntColor } from '../model/int-color.js';
import { ColorView } from '../view/color.js';
interface Config {
    colorType: ColorType;
    expanded: boolean;
    formatter: Formatter<IntColor>;
    parser: Parser<IntColor>;
    pickerLayout: PickerLayout;
    supportsAlpha: boolean;
    value: Value<IntColor>;
    viewProps: ViewProps;
}
/**
 * @hidden
 */
export declare class ColorController implements ValueController<IntColor, ColorView> {
    readonly value: Value<IntColor>;
    readonly view: ColorView;
    readonly viewProps: ViewProps;
    private readonly swatchC_;
    private readonly textC_;
    private readonly pickerC_;
    private readonly popC_;
    private readonly foldable_;
    constructor(doc: Document, config: Config);
    get textController(): TextController<IntColor>;
    private onButtonBlur_;
    private onButtonClick_;
    private onPopupChildBlur_;
    private onPopupChildKeydown_;
}
export {};
