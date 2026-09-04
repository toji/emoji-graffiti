import { ColorInputParams } from '../../blade/common/api/params.js';
import { ColorType } from './model/color-model.js';
export declare function parseColorInputParams(params: Record<string, unknown>): ColorInputParams | undefined;
export declare function getKeyScaleForColor(forAlpha: boolean): number;
export declare function extractColorType(params: ColorInputParams): ColorType | undefined;
