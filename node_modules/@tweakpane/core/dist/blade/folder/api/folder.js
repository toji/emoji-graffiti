import { Emitter } from '../../../common/model/emitter.js';
import { ContainerBladeApi } from '../../common/api/container-blade.js';
import { TpFoldEvent } from '../../common/api/tp-event.js';
export class FolderApi extends ContainerBladeApi {
    /**
     * @hidden
     */
    constructor(controller, pool) {
        super(controller, pool);
        this.emitter_ = new Emitter();
        this.controller.foldable
            .value('expanded')
            .emitter.on('change', (ev) => {
            this.emitter_.emit('fold', new TpFoldEvent(this, ev.sender.rawValue));
        });
        this.rackApi_.on('change', (ev) => {
            this.emitter_.emit('change', ev);
        });
    }
    get expanded() {
        return this.controller.foldable.get('expanded');
    }
    set expanded(expanded) {
        this.controller.foldable.set('expanded', expanded);
    }
    get title() {
        return this.controller.props.get('title');
    }
    set title(title) {
        this.controller.props.set('title', title);
    }
    get children() {
        return this.rackApi_.children;
    }
    addBinding(object, key, opt_params) {
        return this.rackApi_.addBinding(object, key, opt_params);
    }
    addFolder(params) {
        return this.rackApi_.addFolder(params);
    }
    addButton(params) {
        return this.rackApi_.addButton(params);
    }
    addTab(params) {
        return this.rackApi_.addTab(params);
    }
    add(api, opt_index) {
        return this.rackApi_.add(api, opt_index);
    }
    remove(api) {
        this.rackApi_.remove(api);
    }
    addBlade(params) {
        return this.rackApi_.addBlade(params);
    }
    /**
     * Adds a global event listener. It handles all events of child inputs/monitors.
     * @param eventName The event name to listen.
     * @param handler The event handler.
     * @return The API object itself.
     */
    on(eventName, handler) {
        const bh = handler.bind(this);
        this.emitter_.on(eventName, (ev) => {
            bh(ev);
        }, {
            key: handler,
        });
        return this;
    }
    /**
     * Removes a global event listener.
     * @param eventName The event name to listen.
     * @param handler The event handler.
     * @returns The API object itself.
     */
    off(eventName, handler) {
        this.emitter_.off(eventName, handler);
        return this;
    }
}
