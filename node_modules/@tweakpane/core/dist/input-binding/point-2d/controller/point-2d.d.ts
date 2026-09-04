import { ValueController } from '../../../common/controller/value.js';
import { Parser } from '../../../common/converter/parser.js';
import { Value } from '../../../common/model/value.js';
import { ViewProps } from '../../../common/model/view-props.js';
import { PickerLayout } from '../../../common/params.js';
import { PointAxis } from '../../../common/point-nd/point-axis.js';
import { Tuple2 } from '../../../misc/type-util.js';
import { PointNdTextController } from '../../common/controller/point-nd-text.js';
import { Point2d } from '../model/point-2d.js';
import { Point2dView } from '../view/point-2d.js';
interface Config {
    axes: Tuple2<PointAxis>;
    expanded: boolean;
    invertsY: boolean;
    max: number;
    parser: Parser<number>;
    pickerLayout: PickerLayout;
    value: Value<Point2d>;
    viewProps: ViewProps;
}
/**
 * @hidden
 */
export declare class Point2dController implements ValueController<Point2d, Point2dView> {
    readonly value: Value<Point2d>;
    readonly view: Point2dView;
    readonly viewProps: ViewProps;
    private readonly popC_;
    private readonly pickerC_;
    private readonly textC_;
    private readonly foldable_;
    constructor(doc: Document, config: Config);
    get textController(): PointNdTextController<Point2d>;
    private onPadButtonBlur_;
    private onPadButtonClick_;
    private onPopupChildBlur_;
    private onPopupChildKeydown_;
}
export {};
