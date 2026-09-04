import { BladeApi } from '../blade/common/api/blade.js';
import { BladeController } from '../blade/common/controller/blade.js';
/**
 * A cache that maps blade controllers and APIs.
 * @hidden
 */
export declare class BladeApiCache {
    private map_;
    get(bc: BladeController): BladeApi | null;
    has(bc: BladeController): boolean;
    add(bc: BladeController, api: BladeApi): typeof api;
}
