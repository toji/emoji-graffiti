import { BindingApi } from '../../../blade/binding/api/binding.js';
import { MonitorBindingApi } from '../../../blade/binding/api/monitor-binding.js';
import { MonitorBindingController } from '../../../blade/binding/controller/monitor-binding.js';
import { TpBuffer } from '../../../common/model/buffered-value.js';
import { GraphLogController } from '../controller/graph-log.js';
export declare class GraphLogMonitorBindingApi extends BindingApi<TpBuffer<number>, number, MonitorBindingController<number, GraphLogController>> implements MonitorBindingApi<number> {
    get max(): number;
    set max(max: number);
    get min(): number;
    set min(min: number);
}
