import { PluginPool } from '../../../plugin/pool.js';
import { ContainerBladeController } from '../controller/container-blade.js';
import { BladeApi } from './blade.js';
import { RackApi } from './rack.js';
import { Refreshable } from './refreshable.js';
export declare class ContainerBladeApi<C extends ContainerBladeController> extends BladeApi<C> implements Refreshable {
    /**
     * @hidden
     */
    protected readonly rackApi_: RackApi;
    /**
     * @hidden
     */
    constructor(controller: C, pool: PluginPool);
    refresh(): void;
}
export declare function isContainerBladeApi(api: BladeApi): api is ContainerBladeApi<ContainerBladeController>;
