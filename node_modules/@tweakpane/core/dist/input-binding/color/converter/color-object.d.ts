import { Color } from '../model/color.js';
import { ColorType } from '../model/color-model.js';
import { FloatColor } from '../model/float-color.js';
import { IntColor } from '../model/int-color.js';
export declare function colorFromObject(value: unknown, type: 'int'): IntColor;
export declare function colorFromObject(value: unknown, type: 'float'): FloatColor;
export declare function colorFromObject(value: unknown, type: ColorType): Color;
