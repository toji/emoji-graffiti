import { isMonitorBindingValue, } from '../../../common/binding/value/monitor-binding.js';
import { exportBladeState, } from '../../common/controller/blade-state.js';
import { isValueBladeController } from '../../common/controller/value-blade.js';
import { BindingController } from './binding.js';
/**
 * @hidden
 */
export class MonitorBindingController extends BindingController {
    exportState() {
        return exportBladeState(() => super.exportState(), {
            binding: {
                readonly: true,
            },
        });
    }
}
export function isMonitorBindingController(bc) {
    return (isValueBladeController(bc) &&
        isMonitorBindingValue(bc.value));
}
