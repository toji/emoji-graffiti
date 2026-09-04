import { LabelController } from '../../../common/label/controller/label.js';
import { BladeController } from '../../common/controller/blade.js';
import { exportBladeState, importBladeState, } from '../../common/controller/blade-state.js';
import { ButtonController } from './button.js';
export class ButtonBladeController extends BladeController {
    constructor(doc, config) {
        const bc = new ButtonController(doc, {
            props: config.buttonProps,
            viewProps: config.viewProps,
        });
        const lc = new LabelController(doc, {
            blade: config.blade,
            props: config.labelProps,
            valueController: bc,
        });
        super({
            blade: config.blade,
            view: lc.view,
            viewProps: config.viewProps,
        });
        this.buttonController = bc;
        this.labelController = lc;
    }
    importState(state) {
        return importBladeState(state, (s) => super.importState(s) &&
            this.buttonController.importProps(s) &&
            this.labelController.importProps(s), () => ({}), () => true);
    }
    exportState() {
        return exportBladeState(() => super.exportState(), Object.assign(Object.assign({}, this.buttonController.exportProps()), this.labelController.exportProps()));
    }
}
