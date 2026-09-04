import { ValueController } from '../../../common/controller/value.js';
import { Parser } from '../../../common/converter/parser.js';
import { Value } from '../../../common/model/value.js';
import { ViewProps } from '../../../common/model/view-props.js';
import { NumberTextController } from '../../../common/number/controller/number-text.js';
import { PointAxis } from '../../../common/point-nd/point-axis.js';
import { PointNdAssembly } from '../model/point-nd.js';
import { PointNdTextView } from '../view/point-nd-text.js';
interface Config<PointNd> {
    assembly: PointNdAssembly<PointNd>;
    axes: PointAxis[];
    parser: Parser<number>;
    value: Value<PointNd>;
    viewProps: ViewProps;
}
/**
 * @hidden
 */
export declare class PointNdTextController<PointNd> implements ValueController<PointNd, PointNdTextView> {
    readonly value: Value<PointNd>;
    readonly view: PointNdTextView;
    readonly viewProps: ViewProps;
    private readonly acs_;
    constructor(doc: Document, config: Config<PointNd>);
    get textControllers(): NumberTextController[];
}
export {};
