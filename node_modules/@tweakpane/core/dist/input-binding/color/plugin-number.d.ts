import { ColorInputParams } from '../../blade/common/api/params.js';
import { InputBindingPlugin } from '../plugin.js';
import { IntColor } from './model/int-color.js';
interface NumberColorInputParams extends ColorInputParams {
    supportsAlpha: boolean;
}
/**
 * @hidden
 */
export declare const NumberColorInputPlugin: InputBindingPlugin<IntColor, number, NumberColorInputParams>;
export {};
