import { Formatter } from '../../../common/converter/formatter.js';
import { BufferedValue } from '../../../common/model/buffered-value.js';
import { Value } from '../../../common/model/value.js';
import { ValueMap } from '../../../common/model/value-map.js';
import { ViewProps } from '../../../common/model/view-props.js';
import { View } from '../../../common/view/view.js';
export type GraphLogProps = ValueMap<{
    max: number;
    min: number;
}>;
interface Config {
    cursor: Value<number>;
    formatter: Formatter<number>;
    props: GraphLogProps;
    rows: number;
    value: BufferedValue<number>;
    viewProps: ViewProps;
}
/**
 * @hidden
 */
export declare class GraphLogView implements View {
    readonly element: HTMLElement;
    readonly value: BufferedValue<number>;
    private readonly props_;
    private readonly cursor_;
    private readonly formatter_;
    private readonly lineElem_;
    private readonly svgElem_;
    private readonly tooltipElem_;
    constructor(doc: Document, config: Config);
    get graphElement(): Element;
    private update_;
    private onValueUpdate_;
    private onCursorChange_;
}
export {};
