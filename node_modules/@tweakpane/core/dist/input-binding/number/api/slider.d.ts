import { BindingApi } from '../../../blade/binding/api/binding.js';
import { InputBindingApi } from '../../../blade/binding/api/input-binding.js';
import { InputBindingController } from '../../../blade/binding/controller/input-binding.js';
import { SliderTextController } from '../../../common/number/controller/slider-text.js';
export declare class SliderInputBindingApi extends BindingApi<number, number, InputBindingController<number, SliderTextController>> implements InputBindingApi<number, number> {
    get max(): number;
    set max(max: number);
    get min(): number;
    set min(max: number);
}
