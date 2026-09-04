import { InputBindingValue } from '../../../common/binding/value/input-binding.js';
import { ValueController } from '../../../common/controller/value.js';
import { BladeController } from '../../common/controller/blade.js';
import { BladeState } from '../../common/controller/blade-state.js';
import { BindingController } from './binding.js';
/**
 * @hidden
 */
export declare class InputBindingController<In = unknown, Vc extends ValueController<In> = ValueController<In>> extends BindingController<In, Vc, InputBindingValue<In>> {
    importState(state: BladeState): boolean;
}
export declare function isInputBindingController(bc: BladeController): bc is InputBindingController;
