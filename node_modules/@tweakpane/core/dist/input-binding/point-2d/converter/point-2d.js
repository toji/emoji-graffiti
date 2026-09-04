import { Point2d } from '../model/point-2d.js';
export function point2dFromUnknown(value) {
    return Point2d.isObject(value)
        ? new Point2d(value.x, value.y)
        : new Point2d();
}
export function writePoint2d(target, value) {
    target.writeProperty('x', value.x);
    target.writeProperty('y', value.y);
}
