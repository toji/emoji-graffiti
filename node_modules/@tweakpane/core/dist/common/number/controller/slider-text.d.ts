import { BladeState, PropsPortable } from '../../../blade/common/controller/blade-state.js';
import { ValueController } from '../../controller/value.js';
import { Formatter } from '../../converter/formatter.js';
import { Parser } from '../../converter/parser.js';
import { Value } from '../../model/value.js';
import { ViewProps } from '../../model/view-props.js';
import { NumberTextProps } from '../view/number-text.js';
import { SliderProps } from '../view/slider.js';
import { SliderTextView } from '../view/slider-text.js';
import { NumberTextController } from './number-text.js';
import { SliderController } from './slider.js';
/**
 * @hidden
 */
interface Config {
    parser: Parser<number>;
    sliderProps: SliderProps;
    textProps: NumberTextProps;
    value: Value<number>;
    viewProps: ViewProps;
}
/**
 * @hidden
 */
export declare class SliderTextController implements ValueController<number, SliderTextView>, PropsPortable {
    readonly value: Value<number>;
    readonly view: SliderTextView;
    readonly viewProps: ViewProps;
    private readonly sliderC_;
    private readonly textC_;
    constructor(doc: Document, config: Config);
    get sliderController(): SliderController;
    get textController(): NumberTextController;
    importProps(state: BladeState): boolean;
    exportProps(): BladeState;
}
export declare function createSliderTextProps(config: {
    formatter: Formatter<number>;
    keyScale: Value<number>;
    max: Value<number>;
    min: Value<number>;
    pointerScale: number;
}): {
    sliderProps: SliderProps;
    textProps: NumberTextProps;
};
export {};
