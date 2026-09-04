import { BladeController } from './blade.js';
import { exportBladeState, importBladeState } from './blade-state.js';
/**
 * @hidden
 */
export class ContainerBladeController extends BladeController {
    constructor(config) {
        super({
            blade: config.blade,
            view: config.view,
            viewProps: config.rackController.viewProps,
        });
        this.rackController = config.rackController;
    }
    importState(state) {
        return importBladeState(state, (s) => super.importState(s), (p) => ({
            children: p.required.array(p.required.raw),
        }), (result) => {
            return this.rackController.rack.children.every((c, index) => {
                return c.importState(result.children[index]);
            });
        });
    }
    exportState() {
        return exportBladeState(() => super.exportState(), {
            children: this.rackController.rack.children.map((c) => c.exportState()),
        });
    }
}
export function isContainerBladeController(bc) {
    return 'rackController' in bc;
}
