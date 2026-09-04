import { BufferedValueController } from '../../../blade/binding/controller/monitor-binding.js';
import { Formatter } from '../../../common/converter/formatter.js';
import { BufferedValue } from '../../../common/model/buffered-value.js';
import { ViewProps } from '../../../common/model/view-props.js';
import { SingleLogView } from '../view/single-log.js';
interface Config<T> {
    formatter: Formatter<T>;
    value: BufferedValue<T>;
    viewProps: ViewProps;
}
/**
 * @hidden
 */
export declare class SingleLogController<T> implements BufferedValueController<T, SingleLogView<T>> {
    readonly value: BufferedValue<T>;
    readonly view: SingleLogView<T>;
    readonly viewProps: ViewProps;
    constructor(doc: Document, config: Config<T>);
}
export {};
