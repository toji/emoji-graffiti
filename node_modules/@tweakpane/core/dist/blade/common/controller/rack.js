import { insertElementAt, removeElement } from '../../../common/dom-util.js';
import { Rack } from '../model/rack.js';
/**
 * @hidden
 */
export class RackController {
    constructor(config) {
        this.onRackAdd_ = this.onRackAdd_.bind(this);
        this.onRackRemove_ = this.onRackRemove_.bind(this);
        this.element = config.element;
        this.viewProps = config.viewProps;
        const rack = new Rack({
            blade: config.root ? undefined : config.blade,
            viewProps: config.viewProps,
        });
        rack.emitter.on('add', this.onRackAdd_);
        rack.emitter.on('remove', this.onRackRemove_);
        this.rack = rack;
        this.viewProps.handleDispose(() => {
            for (let i = this.rack.children.length - 1; i >= 0; i--) {
                const bc = this.rack.children[i];
                bc.viewProps.set('disposed', true);
            }
        });
    }
    onRackAdd_(ev) {
        if (!ev.root) {
            return;
        }
        insertElementAt(this.element, ev.bladeController.view.element, ev.index);
    }
    onRackRemove_(ev) {
        if (!ev.root) {
            return;
        }
        removeElement(ev.bladeController.view.element);
    }
}
