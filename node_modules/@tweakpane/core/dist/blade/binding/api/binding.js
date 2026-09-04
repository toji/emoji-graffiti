import { Emitter } from '../../../common/model/emitter.js';
import { forceCast } from '../../../misc/type-util.js';
import { BladeApi } from '../../common/api/blade.js';
import { TpChangeEvent } from '../../common/api/tp-event.js';
/**
 * The API for binding between the parameter and the pane.
 * @template In The internal type.
 * @template Ex The external type.
 */
export class BindingApi extends BladeApi {
    /**
     * @hidden
     */
    constructor(controller) {
        super(controller);
        this.onValueChange_ = this.onValueChange_.bind(this);
        this.emitter_ = new Emitter();
        this.controller.value.emitter.on('change', this.onValueChange_);
    }
    get label() {
        return this.controller.labelController.props.get('label');
    }
    set label(label) {
        this.controller.labelController.props.set('label', label);
    }
    /**
     * The key of the bound value.
     */
    get key() {
        return this.controller.value.binding.target.key;
    }
    /**
     * The generic tag with many uses.
     */
    get tag() {
        return this.controller.tag;
    }
    set tag(tag) {
        this.controller.tag = tag;
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
        this.controller.value.fetch();
    }
    onValueChange_(ev) {
        const value = this.controller.value;
        this.emitter_.emit('change', new TpChangeEvent(this, forceCast(value.binding.target.read()), ev.options.last));
    }
}
