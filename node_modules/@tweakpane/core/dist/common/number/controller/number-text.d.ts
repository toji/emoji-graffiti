import { ValueController } from '../../controller/value.js';
import { Parser } from '../../converter/parser.js';
import { Value } from '../../model/value.js';
import { ViewProps } from '../../model/view-props.js';
import { NumberTextProps, NumberTextView } from '../view/number-text.js';
import { SliderProps } from '../view/slider.js';
/**
 * @hidden
 */
interface Config {
    parser: Parser<number>;
    props: NumberTextProps;
    sliderProps?: SliderProps;
    value: Value<number>;
    viewProps: ViewProps;
    arrayPosition?: 'fst' | 'mid' | 'lst';
}
/**
 * @hidden
 */
export declare class NumberTextController implements ValueController<number, NumberTextView> {
    readonly props: NumberTextProps;
    readonly value: Value<number>;
    readonly view: NumberTextView;
    readonly viewProps: ViewProps;
    private readonly sliderProps_;
    private readonly parser_;
    private readonly dragging_;
    private originRawValue_;
    constructor(doc: Document, config: Config);
    private constrainValue_;
    private onInputChange_;
    private onInputKeyDown_;
    private onInputKeyUp_;
    private onPointerDown_;
    private computeDraggingValue_;
    private onPointerMove_;
    private onPointerUp_;
}
export {};
