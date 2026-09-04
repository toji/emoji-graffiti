import { ValueController } from '../../../common/controller/value.js';
import { BladeController } from './blade.js';
export declare function isValueBladeController(bc: BladeController): bc is BladeController & ValueController<unknown>;
