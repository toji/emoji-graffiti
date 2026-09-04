import { bindValueMap } from '../../../common/model/reactive.js';
import { ViewProps } from '../../../common/model/view-props.js';
import { exportBladeState, importBladeState, } from '../../common/controller/blade-state.js';
import { ContainerBladeController } from '../../common/controller/container-blade.js';
import { RackController } from '../../common/controller/rack.js';
import { TabPageView } from '../view/tab-page.js';
import { TabItemController } from './tab-item.js';
/**
 * @hidden
 */
export class TabPageController extends ContainerBladeController {
    constructor(doc, config) {
        const view = new TabPageView(doc, {
            viewProps: config.viewProps,
        });
        super(Object.assign(Object.assign({}, config), { rackController: new RackController({
                blade: config.blade,
                element: view.containerElement,
                viewProps: config.viewProps,
            }), view: view }));
        this.onItemClick_ = this.onItemClick_.bind(this);
        this.ic_ = new TabItemController(doc, {
            props: config.itemProps,
            viewProps: ViewProps.create(),
        });
        this.ic_.emitter.on('click', this.onItemClick_);
        this.props = config.props;
        bindValueMap(this.props, 'selected', (selected) => {
            this.itemController.props.set('selected', selected);
            this.viewProps.set('hidden', !selected);
        });
    }
    get itemController() {
        return this.ic_;
    }
    importState(state) {
        return importBladeState(state, (s) => super.importState(s), (p) => ({
            selected: p.required.boolean,
            title: p.required.string,
        }), (result) => {
            this.ic_.props.set('selected', result.selected);
            this.ic_.props.set('title', result.title);
            return true;
        });
    }
    exportState() {
        return exportBladeState(() => super.exportState(), {
            selected: this.ic_.props.get('selected'),
            title: this.ic_.props.get('title'),
        });
    }
    onItemClick_() {
        this.props.set('selected', true);
    }
}
