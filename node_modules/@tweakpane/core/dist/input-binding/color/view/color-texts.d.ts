import { Value } from '../../../common/model/value.js';
import { ViewProps } from '../../../common/model/view-props.js';
import { InputView, View } from '../../../common/view/view.js';
import { ColorMode } from '../model/color-model.js';
export type ColorTextsMode = ColorMode | 'hex';
interface Config {
    inputViews: InputView[];
    mode: Value<ColorTextsMode>;
    viewProps: ViewProps;
}
/**
 * @hidden
 */
export declare class ColorTextsView implements View {
    readonly element: HTMLElement;
    private readonly modeElem_;
    private readonly inputsElem_;
    private inputViews_;
    constructor(doc: Document, config: Config);
    get modeSelectElement(): HTMLSelectElement;
    get inputViews(): InputView[];
    set inputViews(inputViews: InputView[]);
    private applyInputViews_;
}
export {};
