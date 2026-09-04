import { View } from '../../../common/view/view.js';
import { Blade } from '../model/blade.js';
import { BladeController } from './blade.js';
import { BladeState } from './blade-state.js';
import { RackController } from './rack.js';
/**
 * @hidden
 */
interface Config<V extends View> {
    blade: Blade;
    rackController: RackController;
    view: V;
}
/**
 * @hidden
 */
export declare class ContainerBladeController<V extends View = View> extends BladeController<V> {
    readonly rackController: RackController;
    constructor(config: Config<V>);
    importState(state: BladeState): boolean;
    exportState(): BladeState;
}
export declare function isContainerBladeController(bc: BladeController): bc is ContainerBladeController;
export {};
