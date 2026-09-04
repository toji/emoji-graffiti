import { ViewProps } from '../../../common/model/view-props.js';
import { Blade } from '../model/blade.js';
import { Rack } from '../model/rack.js';
/**
 * @hidden
 */
interface Config {
    blade: Blade;
    element: HTMLElement;
    viewProps: ViewProps;
    root?: boolean;
}
/**
 * @hidden
 */
export declare class RackController {
    readonly element: HTMLElement;
    readonly rack: Rack;
    readonly viewProps: ViewProps;
    constructor(config: Config);
    private onRackAdd_;
    private onRackRemove_;
}
export {};
