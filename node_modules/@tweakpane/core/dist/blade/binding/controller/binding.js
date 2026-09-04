import { isBindingValue, } from '../../../common/binding/value/binding.js';
import { exportBladeState, importBladeState, } from '../../common/controller/blade-state.js';
import { isValueBladeController } from '../../common/controller/value-blade.js';
import { LabeledValueBladeController, } from '../../label/controller/value.js';
function excludeValue(state) {
    const result = Object.assign({}, state);
    delete result.value;
    return result;
}
/**
 * @hidden
 */
export class BindingController extends LabeledValueBladeController {
    constructor(doc, config) {
        super(doc, config);
        this.tag = config.tag;
    }
    importState(state) {
        return importBladeState(state, 
        // Exclude `value` from super.import()
        // value should be imported with binding
        (_s) => super.importState(excludeValue(state)), (p) => ({
            tag: p.optional.string,
        }), (result) => {
            this.tag = result.tag;
            return true;
        });
    }
    exportState() {
        return exportBladeState(() => excludeValue(super.exportState()), {
            binding: {
                key: this.value.binding.target.key,
                value: this.value.binding.target.read(),
            },
            tag: this.tag,
        });
    }
}
export function isBindingController(bc) {
    return isValueBladeController(bc) && isBindingValue(bc.value);
}
