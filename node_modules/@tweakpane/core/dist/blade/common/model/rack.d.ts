import { ValueController } from '../../../common/controller/value.js';
import { Emitter } from '../../../common/model/emitter.js';
import { ValueChangeOptions } from '../../../common/model/value.js';
import { ViewProps } from '../../../common/model/view-props.js';
import { BladeController } from '../controller/blade.js';
import { Blade } from './blade.js';
/**
 * @hidden
 */
export interface RackEvents {
    add: {
        bladeController: BladeController;
        index: number;
        root: boolean;
        sender: Rack;
    };
    remove: {
        bladeController: BladeController;
        root: boolean;
        sender: Rack;
    };
    valuechange: {
        bladeController: BladeController & ValueController<unknown>;
        options: ValueChangeOptions;
        sender: Rack;
    };
    layout: {
        sender: Rack;
    };
}
/**
 * @hidden
 */
interface Config {
    blade?: Blade;
    viewProps: ViewProps;
}
/**
 * A collection of blade controllers that manages positions and event propagation.
 * @hidden
 */
export declare class Rack {
    readonly emitter: Emitter<RackEvents>;
    readonly viewProps: ViewProps;
    private readonly blade_;
    private readonly bcSet_;
    constructor(config: Config);
    get children(): BladeController[];
    add(bc: BladeController, opt_index?: number): void;
    remove(bc: BladeController): void;
    find<B extends BladeController>(finder: (bc: BladeController) => bc is B): B[];
    private onSetAdd_;
    private onSetRemove_;
    private updatePositions_;
    private onChildPositionsChange_;
    private onChildViewPropsChange_;
    private onChildDispose_;
    private onChildValueChange_;
    private onRackLayout_;
    private onRackValueChange_;
    private onBladePositionsChange_;
}
export {};
