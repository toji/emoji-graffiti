import { Point2dInputParams } from '../../blade/common/api/params.js';
import { InputBindingPlugin } from '../plugin.js';
import { Point2d, Point2dObject } from './model/point-2d.js';
export declare function getSuitableMax(params: Point2dInputParams, initialValue: Point2d): number;
/**
 * @hidden
 */
export declare const Point2dInputPlugin: InputBindingPlugin<Point2d, Point2dObject, Point2dInputParams>;
