import { ContainerBladeApi } from '../../common/api/container-blade.js';
export class TabPageApi extends ContainerBladeApi {
    get title() {
        var _a;
        return (_a = this.controller.itemController.props.get('title')) !== null && _a !== void 0 ? _a : '';
    }
    set title(title) {
        this.controller.itemController.props.set('title', title);
    }
    get selected() {
        return this.controller.props.get('selected');
    }
    set selected(selected) {
        this.controller.props.set('selected', selected);
    }
    get children() {
        return this.rackApi_.children;
    }
    addButton(params) {
        return this.rackApi_.addButton(params);
    }
    addFolder(params) {
        return this.rackApi_.addFolder(params);
    }
    addTab(params) {
        return this.rackApi_.addTab(params);
    }
    add(api, opt_index) {
        this.rackApi_.add(api, opt_index);
    }
    remove(api) {
        this.rackApi_.remove(api);
    }
    addBinding(object, key, opt_params) {
        return this.rackApi_.addBinding(object, key, opt_params);
    }
    addBlade(params) {
        return this.rackApi_.addBlade(params);
    }
}
