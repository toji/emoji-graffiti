import { ColorInputParams } from '../../blade/common/api/params.js';
import { InputBindingPlugin } from '../plugin.js';
import { RgbaColorObject, RgbColorObject } from './model/color.js';
import { ColorType } from './model/color-model.js';
import { IntColor } from './model/int-color.js';
interface ObjectColorInputParams extends ColorInputParams {
    colorType: ColorType;
}
/**
 * @hidden
 */
export declare const ObjectColorInputPlugin: InputBindingPlugin<IntColor, RgbColorObject | RgbaColorObject, ObjectColorInputParams>;
export {};
