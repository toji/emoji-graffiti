import { Bindable } from '../../../common/binding/target.js';
import { BaseBladeParams } from '../../../common/params.js';
import { PluginPool } from '../../../plugin/pool.js';
import { BindingApi } from '../../binding/api/binding.js';
import { ButtonApi } from '../../button/api/button.js';
import { BladeApi } from '../../common/api/blade.js';
import { ContainerApi } from '../../common/api/container.js';
import { ContainerBladeApi } from '../../common/api/container-blade.js';
import { EventListenable } from '../../common/api/event-listenable.js';
import { BindingParams, ButtonParams, FolderParams, TabParams } from '../../common/api/params.js';
import { TpChangeEvent, TpFoldEvent } from '../../common/api/tp-event.js';
import { TabApi } from '../../tab/api/tab.js';
import { FolderController } from '../controller/folder.js';
export interface FolderApiEvents {
    change: TpChangeEvent<unknown, BladeApi>;
    fold: TpFoldEvent<FolderApi>;
}
export declare class FolderApi extends ContainerBladeApi<FolderController> implements ContainerApi, EventListenable<FolderApiEvents> {
    private readonly emitter_;
    /**
     * @hidden
     */
    constructor(controller: FolderController, pool: PluginPool);
    get expanded(): boolean;
    set expanded(expanded: boolean);
    get title(): string | undefined;
    set title(title: string | undefined);
    get children(): BladeApi[];
    addBinding<O extends Bindable, Key extends keyof O>(object: O, key: Key, opt_params?: BindingParams): BindingApi<unknown, O[Key]>;
    addFolder(params: FolderParams): FolderApi;
    addButton(params: ButtonParams): ButtonApi;
    addTab(params: TabParams): TabApi;
    add<A extends BladeApi>(api: A, opt_index?: number): A;
    remove(api: BladeApi): void;
    addBlade(params: BaseBladeParams): BladeApi;
    /**
     * Adds a global event listener. It handles all events of child inputs/monitors.
     * @param eventName The event name to listen.
     * @param handler The event handler.
     * @return The API object itself.
     */
    on<EventName extends keyof FolderApiEvents>(eventName: EventName, handler: (ev: FolderApiEvents[EventName]) => void): this;
    /**
     * Removes a global event listener.
     * @param eventName The event name to listen.
     * @param handler The event handler.
     * @returns The API object itself.
     */
    off<EventName extends keyof FolderApiEvents>(eventName: EventName, handler: (ev: FolderApiEvents[EventName]) => void): this;
}
