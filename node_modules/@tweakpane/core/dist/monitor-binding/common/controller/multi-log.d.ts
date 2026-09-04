import { BufferedValueController } from '../../../blade/binding/controller/monitor-binding.js';
import { Formatter } from '../../../common/converter/formatter.js';
import { BufferedValue } from '../../../common/model/buffered-value.js';
import { ViewProps } from '../../../common/model/view-props.js';
import { MultiLogView } from '../view/multi-log.js';
interface Config<T> {
    formatter: Formatter<T>;
    rows: number;
    value: BufferedValue<T>;
    viewProps: ViewProps;
}
/**
 * @hidden
 */
export declare class MultiLogController<T> implements BufferedValueController<T, MultiLogView<T>> {
    readonly value: BufferedValue<T>;
    readonly view: MultiLogView<T>;
    readonly viewProps: ViewProps;
    constructor(doc: Document, config: Config<T>);
}
export {};
