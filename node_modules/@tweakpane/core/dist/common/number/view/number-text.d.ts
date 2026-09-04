import { Value } from '../../../common/model/value.js';
import { ValueMap } from '../../../common/model/value-map.js';
import { ViewProps } from '../../../common/model/view-props.js';
import { InputView, View } from '../../../common/view/view.js';
import { Formatter } from '../../converter/formatter.js';
export type NumberTextPropsObject = {
    formatter: Formatter<number>;
    keyScale: number;
    pointerScale: number;
};
/**
 * @hidden
 */
export type NumberTextProps = ValueMap<NumberTextPropsObject>;
/**
 * @hidden
 */
interface NumberConfig {
    dragging: Value<number | null>;
    props: NumberTextProps;
    value: Value<number>;
    viewProps: ViewProps;
    arrayPosition?: 'fst' | 'mid' | 'lst';
}
/**
 * @hidden
 */
export declare class NumberTextView implements View, InputView {
    readonly inputElement: HTMLInputElement;
    readonly knobElement: HTMLElement;
    readonly element: HTMLElement;
    readonly value: Value<number>;
    private readonly props_;
    private readonly dragging_;
    private readonly guideBodyElem_;
    private readonly guideHeadElem_;
    private readonly tooltipElem_;
    constructor(doc: Document, config: NumberConfig);
    private onDraggingChange_;
    refresh(): void;
    private onChange_;
}
export {};
