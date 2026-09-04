import { BindingApi } from '../blade/binding/api/binding.js';
import { BindingController } from '../blade/binding/controller/binding.js';
import { BladeApi } from '../blade/common/api/blade.js';
import { BindingParams } from '../blade/common/api/params.js';
import { BladeController } from '../blade/common/controller/blade.js';
import { BindingTarget } from '../common/binding/target.js';
import { BladeApiCache } from './blade-api-cache.js';
import { TpPlugin } from './plugins.js';
/**
 * @hidden
 */
export declare class PluginPool {
    private readonly apiCache_;
    private readonly pluginsMap_;
    constructor(apiCache: BladeApiCache);
    getAll(): TpPlugin[];
    register(bundleId: string, r: TpPlugin): void;
    private createInput_;
    private createMonitor_;
    createBinding(doc: Document, target: BindingTarget, params: BindingParams): BindingController;
    createBlade(document: Document, params: Record<string, unknown>): BladeController;
    private createInputBindingApi_;
    private createMonitorBindingApi_;
    createBindingApi(bc: BindingController): BindingApi;
    createApi(bc: BladeController): BladeApi;
}
