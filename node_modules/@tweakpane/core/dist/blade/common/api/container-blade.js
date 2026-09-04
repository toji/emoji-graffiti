import { BladeApi } from './blade.js';
import { RackApi } from './rack.js';
export class ContainerBladeApi extends BladeApi {
    /**
     * @hidden
     */
    constructor(controller, pool) {
        super(controller);
        this.rackApi_ = new RackApi(controller.rackController, pool);
    }
    refresh() {
        this.rackApi_.refresh();
    }
}
export function isContainerBladeApi(api) {
    return 'rackApi_' in api;
}
