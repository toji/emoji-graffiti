import { insertElementAt, removeElement } from '../../../common/dom-util.js';
import { ContainerBladeController } from '../../common/controller/container-blade.js';
import { RackController } from '../../common/controller/rack.js';
import { Tab } from '../model/tab.js';
import { TabView } from '../view/tab.js';
/**
 * @hidden
 */
export class TabController extends ContainerBladeController {
    constructor(doc, config) {
        const tab = new Tab();
        const view = new TabView(doc, {
            empty: tab.empty,
            viewProps: config.viewProps,
        });
        super({
            blade: config.blade,
            rackController: new RackController({
                blade: config.blade,
                element: view.contentsElement,
                viewProps: config.viewProps,
            }),
            view: view,
        });
        this.onRackAdd_ = this.onRackAdd_.bind(this);
        this.onRackRemove_ = this.onRackRemove_.bind(this);
        const rack = this.rackController.rack;
        rack.emitter.on('add', this.onRackAdd_);
        rack.emitter.on('remove', this.onRackRemove_);
        this.tab = tab;
    }
    add(pc, opt_index) {
        this.rackController.rack.add(pc, opt_index);
    }
    remove(index) {
        this.rackController.rack.remove(this.rackController.rack.children[index]);
    }
    onRackAdd_(ev) {
        if (!ev.root) {
            return;
        }
        const pc = ev.bladeController;
        insertElementAt(this.view.itemsElement, pc.itemController.view.element, ev.index);
        pc.itemController.viewProps.set('parent', this.viewProps);
        this.tab.add(pc.props.value('selected'));
    }
    onRackRemove_(ev) {
        if (!ev.root) {
            return;
        }
        const pc = ev.bladeController;
        removeElement(pc.itemController.view.element);
        pc.itemController.viewProps.set('parent', null);
        this.tab.remove(pc.props.value('selected'));
    }
}
