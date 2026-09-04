import { Controller } from '../../../common/controller/controller.js';
import { ViewProps } from '../../../common/model/view-props.js';
import { View } from '../../../common/view/view.js';
import { Blade } from '../model/blade.js';
import { Rack } from '../model/rack.js';
import { BladeState } from './blade-state.js';
/**
 * @hidden
 */
interface Config<V extends View> {
    blade: Blade;
    view: V;
    viewProps: ViewProps;
}
/**
 * @hidden
 */
export declare class BladeController<V extends View = View> implements Controller<V> {
    readonly blade: Blade;
    readonly view: V;
    readonly viewProps: ViewProps;
    private parent_;
    constructor(config: Config<V>);
    get parent(): Rack | null;
    set parent(parent: Rack | null);
    /**
     * Import a state from the object.
     * @param state The object to import.
     * @return true if succeeded, false otherwise.
     */
    importState(state: BladeState): boolean;
    /**
     * Export a state to the object.
     * @return A state object.
     */
    exportState(): BladeState;
}
export {};
