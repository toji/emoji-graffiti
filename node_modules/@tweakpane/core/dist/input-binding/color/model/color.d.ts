import { ColorComponents3, ColorComponents4, ColorMode, ColorType } from './color-model.js';
export interface RgbColorObject {
    r: number;
    g: number;
    b: number;
}
export interface RgbaColorObject {
    r: number;
    g: number;
    b: number;
    a: number;
}
export declare function isRgbColorObject(obj: unknown): obj is RgbColorObject;
export declare function isRgbaColorObject(obj: unknown): obj is RgbaColorObject;
export declare function isColorObject(obj: unknown): obj is RgbColorObject | RgbaColorObject;
export interface Color {
    readonly mode: ColorMode;
    readonly type: ColorType;
    getComponents(opt_mode?: ColorMode): ColorComponents4;
    toRgbaObject(): RgbaColorObject;
}
export declare function equalsColor(v1: Color, v2: Color): boolean;
export declare function createColorComponentsFromRgbObject(obj: RgbColorObject | RgbaColorObject): ColorComponents3 | ColorComponents4;
