import { Formatter } from '../../../common/converter/formatter.js';
import { Parser } from '../../../common/converter/parser.js';
import { Color } from '../model/color.js';
import { ColorMode, ColorType } from '../model/color-model.js';
import { FloatColor } from '../model/float-color.js';
import { IntColor } from '../model/int-color.js';
type StringColorNotation = 'func' | 'hex' | 'object';
export interface StringColorFormat {
    alpha: boolean;
    mode: ColorMode;
    notation: StringColorNotation;
    type: ColorType;
}
export declare function detectStringColorFormat(text: string, type?: ColorType): StringColorFormat | null;
export declare function createColorStringParser(type: 'int'): Parser<IntColor>;
export declare function createColorStringParser(type: 'float'): Parser<FloatColor>;
export declare function readIntColorString(value: unknown): IntColor;
export declare function colorToHexRgbString(value: IntColor, prefix?: string): string;
export declare function colorToHexRgbaString(value: IntColor, prefix?: string): string;
export declare function colorToFunctionalRgbString(value: Color): string;
export declare function colorToFunctionalRgbaString(value: Color): string;
export declare function colorToFunctionalHslString(value: Color): string;
export declare function colorToFunctionalHslaString(value: Color): string;
export declare function colorToObjectRgbString(value: Color, type: ColorType): string;
export declare function colorToObjectRgbaString(value: Color, type: ColorType): string;
export declare function findColorStringifier(format: StringColorFormat): Formatter<Color> | null;
export {};
