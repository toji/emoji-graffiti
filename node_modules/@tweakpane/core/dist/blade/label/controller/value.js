import { LabelController } from '../../../common/label/controller/label.js';
import { LabelView } from '../../../common/label/view/label.js';
import { TpError } from '../../../common/tp-error.js';
import { BladeController } from '../../common/controller/blade.js';
import { exportBladeState, importBladeState, } from '../../common/controller/blade-state.js';
/**
 * @hidden
 */
export class LabeledValueBladeController extends BladeController {
    constructor(doc, config) {
        if (config.value !== config.valueController.value) {
            throw TpError.shouldNeverHappen();
        }
        const viewProps = config.valueController.viewProps;
        const lc = new LabelController(doc, {
            blade: config.blade,
            props: config.props,
            valueController: config.valueController,
        });
        super(Object.assign(Object.assign({}, config), { view: new LabelView(doc, {
                props: config.props,
                viewProps: viewProps,
            }), viewProps: viewProps }));
        this.labelController = lc;
        this.value = config.value;
        this.valueController = config.valueController;
        this.view.valueElement.appendChild(this.valueController.view.element);
    }
    importState(state) {
        return importBladeState(state, (s) => {
            var _a, _b, _c;
            return super.importState(s) &&
                this.labelController.importProps(s) &&
                ((_c = (_b = (_a = this.valueController).importProps) === null || _b === void 0 ? void 0 : _b.call(_a, state)) !== null && _c !== void 0 ? _c : true);
        }, (p) => ({
            value: p.optional.raw,
        }), (result) => {
            if (result.value) {
                this.value.rawValue = result.value;
            }
            return true;
        });
    }
    exportState() {
        var _a, _b, _c;
        return exportBladeState(() => super.exportState(), Object.assign(Object.assign({ value: this.value.rawValue }, this.labelController.exportProps()), ((_c = (_b = (_a = this.valueController).exportProps) === null || _b === void 0 ? void 0 : _b.call(_a)) !== null && _c !== void 0 ? _c : {})));
    }
}
