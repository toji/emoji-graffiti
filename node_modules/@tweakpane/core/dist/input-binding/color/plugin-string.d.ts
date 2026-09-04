import { ColorInputParams } from '../../blade/common/api/params.js';
import { Formatter } from '../../common/converter/formatter.js';
import { InputBindingPlugin } from '../plugin.js';
import { StringColorFormat } from './converter/color-string.js';
import { Color } from './model/color.js';
import { IntColor } from './model/int-color.js';
interface StringColorInputParams extends ColorInputParams {
    format: StringColorFormat;
    stringifier: Formatter<Color>;
}
/**
 * @hidden
 */
export declare const StringColorInputPlugin: InputBindingPlugin<IntColor, string, StringColorInputParams>;
export {};
