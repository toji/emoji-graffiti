import { ValueController } from '../../controller/value.js';
import { Value } from '../../model/value.js';
import { ViewProps } from '../../model/view-props.js';
import { SliderProps, SliderView } from '../view/slider.js';
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
export declare class SliderController implements ValueController<number, SliderView> {
    readonly value: Value<number>;
    readonly view: SliderView;
    readonly viewProps: ViewProps;
    readonly props: SliderProps;
    private readonly ptHandler_;
    constructor(doc: Document, config: Config);
    private handlePointerEvent_;
    private onPointerDownOrMove_;
    private onPointerUp_;
    private onKeyDown_;
    private onKeyUp_;
}
export {};
