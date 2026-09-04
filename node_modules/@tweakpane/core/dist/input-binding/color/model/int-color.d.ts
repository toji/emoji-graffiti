import { Color, RgbaColorObject } from './color.js';
import { ColorComponents3, ColorComponents4, ColorMode, ColorType } from './color-model.js';
export declare class IntColor implements Color {
    static black(): IntColor;
    private readonly comps_;
    readonly mode: ColorMode;
    readonly type: ColorType;
    constructor(comps: ColorComponents3 | ColorComponents4, mode: ColorMode);
    getComponents(opt_mode?: ColorMode): ColorComponents4;
    toRgbaObject(): RgbaColorObject;
}
