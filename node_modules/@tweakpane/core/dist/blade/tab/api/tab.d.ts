import { PluginPool } from '../../../plugin/pool.js';
import { BladeApi } from '../../common/api/blade.js';
import { ContainerBladeApi } from '../../common/api/container-blade.js';
import { EventListenable } from '../../common/api/event-listenable.js';
import { TpChangeEvent, TpTabSelectEvent } from '../../common/api/tp-event.js';
import { TabController } from '../controller/tab.js';
import { TabPageApi } from './tab-page.js';
interface TabApiEvents {
    change: TpChangeEvent<unknown, BladeApi>;
    select: TpTabSelectEvent<TabApi>;
}
export interface TabPageParams {
    title: string;
    index?: number;
}
export declare class TabApi extends ContainerBladeApi<TabController> implements EventListenable<TabApiEvents> {
    private readonly emitter_;
    private readonly pool_;
    /**
     * @hidden
     */
    constructor(controller: TabController, pool: PluginPool);
    get pages(): TabPageApi[];
    addPage(params: TabPageParams): TabPageApi;
    removePage(index: number): void;
    on<EventName extends keyof TabApiEvents>(eventName: EventName, handler: (ev: TabApiEvents[EventName]) => void): this;
    off<EventName extends keyof TabApiEvents>(eventName: EventName, handler: (ev: TabApiEvents[EventName]) => void): this;
    private onSelect_;
}
export {};
