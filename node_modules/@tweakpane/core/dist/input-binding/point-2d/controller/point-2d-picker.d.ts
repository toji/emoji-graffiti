import { ValueController } from '../../../common/controller/value.js';
import { Value } from '../../../common/model/value.js';
import { ViewProps } from '../../../common/model/view-props.js';
import { PickerLayout } from '../../../common/params.js';
import { Point2d } from '../model/point-2d.js';
import { Point2dPickerProps, Point2dPickerView } from '../view/point-2d-picker.js';
interface Config {
    layout: PickerLayout;
    props: Point2dPickerProps;
    value: Value<Point2d>;
    viewProps: ViewProps;
}
/**
 * @hidden
 */
export declare class Point2dPickerController implements ValueController<Point2d, Point2dPickerView> {
    readonly props: Point2dPickerProps;
    readonly value: Value<Point2d>;
    readonly view: Point2dPickerView;
    readonly viewProps: ViewProps;
    private readonly ptHandler_;
    constructor(doc: Document, config: Config);
    private handlePointerEvent_;
    private onPointerDown_;
    private onPointerMove_;
    private onPointerUp_;
    private onPadKeyDown_;
    private onPadKeyUp_;
}
export {};
