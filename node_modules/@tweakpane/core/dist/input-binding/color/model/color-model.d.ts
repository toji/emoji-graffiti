import { Tuple3, Tuple4 } from '../../../misc/type-util.js';
export type ColorComponents3 = Tuple3<number>;
export type ColorComponents4 = Tuple4<number>;
export type ColorMode = 'hsl' | 'hsv' | 'rgb';
export type ColorType = 'float' | 'int';
export declare function hsvToRgbInt(h: number, s: number, v: number): ColorComponents3;
export declare function hslToHsvInt(h: number, s: number, l: number): ColorComponents3;
export declare function hsvToHslInt(h: number, s: number, v: number): ColorComponents3;
export declare function removeAlphaComponent(comps: ColorComponents4): ColorComponents3;
export declare function appendAlphaComponent(comps: ColorComponents3, alpha: number): ColorComponents4;
export declare function getColorMaxComponents(mode: ColorMode, type: ColorType): ColorComponents3;
export declare function constrainColorComponents(components: ColorComponents3 | ColorComponents4, mode: ColorMode, type: ColorType): ColorComponents4;
export declare function convertColor(components: ColorComponents3, from: {
    mode: ColorMode;
    type: ColorType;
}, to: {
    mode: ColorMode;
    type: ColorType;
}): ColorComponents3;
