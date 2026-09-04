import { BindingTarget } from '../../../common/binding/target.js';
import { isBindingValue } from '../../../common/binding/value/binding.js';
import { Emitter } from '../../../common/model/emitter.js';
import { TpError } from '../../../common/tp-error.js';
import { addButtonAsBlade, addFolderAsBlade, addTabAsBlade, } from './container.js';
import { isRefreshable } from './refreshable.js';
import { TpChangeEvent } from './tp-event.js';
function createBindingTarget(obj, key) {
    if (!BindingTarget.isBindable(obj)) {
        throw TpError.notBindable();
    }
    return new BindingTarget(obj, key);
}
/**
 * @hidden
 */
export class RackApi {
    constructor(controller, pool) {
        this.onRackValueChange_ = this.onRackValueChange_.bind(this);
        this.controller_ = controller;
        this.emitter_ = new Emitter();
        this.pool_ = pool;
        const rack = this.controller_.rack;
        rack.emitter.on('valuechange', this.onRackValueChange_);
    }
    get children() {
        return this.controller_.rack.children.map((bc) => this.pool_.createApi(bc));
    }
    addBinding(object, key, opt_params) {
        const params = opt_params !== null && opt_params !== void 0 ? opt_params : {};
        const doc = this.controller_.element.ownerDocument;
        const bc = this.pool_.createBinding(doc, createBindingTarget(object, key), params);
        const api = this.pool_.createBindingApi(bc);
        return this.add(api, params.index);
    }
    addFolder(params) {
        return addFolderAsBlade(this, params);
    }
    addButton(params) {
        return addButtonAsBlade(this, params);
    }
    addTab(params) {
        return addTabAsBlade(this, params);
    }
    add(api, opt_index) {
        const bc = api.controller;
        this.controller_.rack.add(bc, opt_index);
        return api;
    }
    remove(api) {
        this.controller_.rack.remove(api.controller);
    }
    addBlade(params) {
        const doc = this.controller_.element.ownerDocument;
        const bc = this.pool_.createBlade(doc, params);
        const api = this.pool_.createApi(bc);
        return this.add(api, params.index);
    }
    on(eventName, handler) {
        const bh = handler.bind(this);
        this.emitter_.on(eventName, (ev) => {
            bh(ev);
        }, {
            key: handler,
        });
        return this;
    }
    off(eventName, handler) {
        this.emitter_.off(eventName, handler);
        return this;
    }
    refresh() {
        this.children.forEach((c) => {
            if (isRefreshable(c)) {
                c.refresh();
            }
        });
    }
    onRackValueChange_(ev) {
        const bc = ev.bladeController;
        const api = this.pool_.createApi(bc);
        const binding = isBindingValue(bc.value) ? bc.value.binding : null;
        this.emitter_.emit('change', new TpChangeEvent(api, binding ? binding.target.read() : bc.value.rawValue, ev.options.last));
    }
}
