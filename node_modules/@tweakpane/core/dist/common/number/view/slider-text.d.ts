import { View } from '../../../common/view/view.js';
import { NumberTextView } from './number-text.js';
import { SliderView } from './slider.js';
/**
 * @hidden
 */
interface Config {
    sliderView: SliderView;
    textView: NumberTextView;
}
/**
 * @hidden
 */
export declare class SliderTextView implements View {
    readonly element: HTMLElement;
    private readonly sliderView_;
    private readonly textView_;
    constructor(doc: Document, config: Config);
}
export {};
