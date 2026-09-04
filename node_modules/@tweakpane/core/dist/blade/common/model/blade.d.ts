import { ValueMap } from '../../../common/model/value-map.js';
import { BladePosition } from './blade-positions.js';
export type Blade = ValueMap<{
    positions: BladePosition[];
}>;
export declare function createBlade(): Blade;
