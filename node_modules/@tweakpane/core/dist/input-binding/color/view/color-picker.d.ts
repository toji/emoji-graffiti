import { ViewProps } from '../../../common/model/view-props.js';
import { NumberTextView } from '../../../common/number/view/number-text.js';
import { View } from '../../../common/view/view.js';
import { APaletteView } from './a-palette.js';
import { ColorTextsView } from './color-texts.js';
import { HPaletteView } from './h-palette.js';
import { SvPaletteView } from './sv-palette.js';
interface Config {
    alphaViews: {
        palette: APaletteView;
        text: NumberTextView;
    } | null;
    hPaletteView: HPaletteView;
    supportsAlpha: boolean;
    svPaletteView: SvPaletteView;
    textsView: ColorTextsView;
    viewProps: ViewProps;
}
/**
 * @hidden
 */
export declare class ColorPickerView implements View {
    readonly element: HTMLElement;
    private readonly alphaViews_;
    private readonly hPaletteView_;
    private readonly svPaletteView_;
    private readonly textsView_;
    constructor(doc: Document, config: Config);
    get allFocusableElements(): HTMLElement[];
}
export {};
