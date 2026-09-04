import { Value } from '../../../common/model/value.js';
import { ValueMap } from '../../../common/model/value-map.js';
import { ViewProps } from '../../../common/model/view-props.js';
import { View } from '../../../common/view/view.js';
/**
 * @hidden
 */
export type SliderPropsObject = {
    keyScale: number;
    max: number;
    min: number;
};
/**
 * @hidden
 */
export type SliderProps = ValueMap<SliderPropsObject>;
/**
 * @hidden
 */
interface Config {
    props: SliderProps;
    value: Value<number>;
    viewProps: ViewProps;
}
/**
 * @hidden
 */
export declare class SliderView implements View {
    readonly element: HTMLElement;
    readonly knobElement: HTMLDivElement;
    readonly trackElement: HTMLDivElement;
    readonly value: Value<number>;
    private readonly props_;
    constructor(doc: Document, config: Config);
    private update_;
    private onChange_;
}
export {};
