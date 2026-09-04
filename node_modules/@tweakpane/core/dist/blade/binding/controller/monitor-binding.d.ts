import { MonitorBindingValue } from '../../../common/binding/value/monitor-binding.js';
import { ValueController } from '../../../common/controller/value.js';
import { TpBuffer } from '../../../common/model/buffered-value.js';
import { View } from '../../../common/view/view.js';
import { BladeController } from '../../common/controller/blade.js';
import { BladeState } from '../../common/controller/blade-state.js';
import { BindingController } from './binding.js';
export type BufferedValueController<T, Vw extends View = View> = ValueController<TpBuffer<T>, Vw>;
/**
 * @hidden
 */
export declare class MonitorBindingController<T = unknown, Vc extends BufferedValueController<T> = BufferedValueController<T>> extends BindingController<TpBuffer<T>, Vc, MonitorBindingValue<T>> {
    exportState(): BladeState;
}
export declare function isMonitorBindingController(bc: BladeController): bc is MonitorBindingController;
