import { BufferedValueController } from '../../../blade/binding/controller/monitor-binding.js';
import { BladeState, PropsPortable } from '../../../blade/common/controller/blade-state.js';
import { Formatter } from '../../../common/converter/formatter.js';
import { BufferedValue } from '../../../common/model/buffered-value.js';
import { ViewProps } from '../../../common/model/view-props.js';
import { GraphLogProps, GraphLogView } from '../view/graph-log.js';
interface Config {
    formatter: Formatter<number>;
    props: GraphLogProps;
    rows: number;
    value: BufferedValue<number>;
    viewProps: ViewProps;
}
/**
 * @hidden
 */
export declare class GraphLogController implements BufferedValueController<number, GraphLogView>, PropsPortable {
    readonly props: GraphLogProps;
    readonly value: BufferedValue<number>;
    readonly view: GraphLogView;
    readonly viewProps: ViewProps;
    private readonly cursor_;
    constructor(doc: Document, config: Config);
    importProps(state: BladeState): boolean;
    exportProps(): BladeState;
    private onGraphMouseLeave_;
    private onGraphMouseMove_;
    private onGraphPointerDown_;
    private onGraphPointerMove_;
    private onGraphPointerUp_;
}
export {};
