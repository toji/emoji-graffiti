import { removeElement } from '../../../common/dom-util.js';
import { ClassName } from '../../../common/view/class-name.js';
import { getAllBladePositions } from '../model/blade-positions.js';
import { exportBladeState, importBladeState } from './blade-state.js';
const cn = ClassName('');
const POS_TO_CLASS_NAME_MAP = {
    veryfirst: 'vfst',
    first: 'fst',
    last: 'lst',
    verylast: 'vlst',
};
/**
 * @hidden
 */
export class BladeController {
    constructor(config) {
        this.parent_ = null;
        this.blade = config.blade;
        this.view = config.view;
        this.viewProps = config.viewProps;
        const elem = this.view.element;
        this.blade.value('positions').emitter.on('change', () => {
            getAllBladePositions().forEach((pos) => {
                elem.classList.remove(cn(undefined, POS_TO_CLASS_NAME_MAP[pos]));
            });
            this.blade.get('positions').forEach((pos) => {
                elem.classList.add(cn(undefined, POS_TO_CLASS_NAME_MAP[pos]));
            });
        });
        this.viewProps.handleDispose(() => {
            removeElement(elem);
        });
    }
    get parent() {
        return this.parent_;
    }
    set parent(parent) {
        this.parent_ = parent;
        this.viewProps.set('parent', this.parent_ ? this.parent_.viewProps : null);
    }
    /**
     * Import a state from the object.
     * @param state The object to import.
     * @return true if succeeded, false otherwise.
     */
    importState(state) {
        return importBladeState(state, null, (p) => ({
            disabled: p.required.boolean,
            hidden: p.required.boolean,
        }), (result) => {
            this.viewProps.importState(result);
            return true;
        });
    }
    /**
     * Export a state to the object.
     * @return A state object.
     */
    exportState() {
        return exportBladeState(null, Object.assign({}, this.viewProps.exportState()));
    }
}
