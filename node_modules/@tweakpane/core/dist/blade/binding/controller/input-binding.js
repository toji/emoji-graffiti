import { isInputBindingValue, } from '../../../common/binding/value/input-binding.js';
import { importBladeState, } from '../../common/controller/blade-state.js';
import { isValueBladeController } from '../../common/controller/value-blade.js';
import { BindingController } from './binding.js';
/**
 * @hidden
 */
export class InputBindingController extends BindingController {
    importState(state) {
        return importBladeState(state, (s) => super.importState(s), (p) => ({
            binding: p.required.object({
                value: p.required.raw,
            }),
        }), (result) => {
            this.value.binding.inject(result.binding.value);
            this.value.fetch();
            return true;
        });
    }
}
export function isInputBindingController(bc) {
    return isValueBladeController(bc) && isInputBindingValue(bc.value);
}
