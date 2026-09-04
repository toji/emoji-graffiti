import { Bindable } from '../../../common/binding/target.js';
import { BaseBladeParams } from '../../../common/params.js';
import { PluginPool } from '../../../plugin/pool.js';
import { BindingApi } from '../../binding/api/binding.js';
import { ButtonApi } from '../../button/api/button.js';
import { FolderApi } from '../../folder/api/folder.js';
import { TabApi } from '../../tab/api/tab.js';
import { RackController } from '../controller/rack.js';
import { BladeApi } from './blade.js';
import { ContainerApi } from './container.js';
import { EventListenable } from './event-listenable.js';
import { BindingParams, ButtonParams, FolderParams, TabParams } from './params.js';
import { TpChangeEvent } from './tp-event.js';
/**
 * @hidden
 */
interface RackApiEvents {
    change: TpChangeEvent<unknown, BladeApi>;
}
/**
 * @hidden
 */
export declare class RackApi implements ContainerApi, EventListenable<RackApiEvents> {
    private readonly controller_;
    private readonly emitter_;
    private readonly pool_;
    constructor(controller: RackController, pool: PluginPool);
    get children(): BladeApi[];
    addBinding<O extends Bindable, Key extends keyof O>(object: O, key: Key, opt_params?: BindingParams): BindingApi<unknown, O[Key]>;
    addFolder(params: FolderParams): FolderApi;
    addButton(params: ButtonParams): ButtonApi;
    addTab(params: TabParams): TabApi;
    add<A extends BladeApi>(api: A, opt_index?: number): A;
    remove(api: BladeApi): void;
    addBlade(params: BaseBladeParams): BladeApi;
    on<EventName extends keyof RackApiEvents>(eventName: EventName, handler: (ev: RackApiEvents[EventName]) => void): this;
    off<EventName extends keyof RackApiEvents>(eventName: EventName, handler: (ev: RackApiEvents[EventName]) => void): this;
    refresh(): void;
    private onRackValueChange_;
}
export {};
