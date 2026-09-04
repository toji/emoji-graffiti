import { disableTransitionTemporarily, forceReflow, } from '../../../common/dom-util.js';
import { bindValueMap } from '../../../common/model/reactive.js';
import { ValueMap } from '../../../common/model/value-map.js';
import { isEmpty } from '../../../misc/type-util.js';
/**
 * @hidden
 */
export class Foldable extends ValueMap {
    constructor(valueMap) {
        super(valueMap);
    }
    static create(expanded) {
        const coreObj = {
            completed: true,
            expanded: expanded,
            expandedHeight: null,
            shouldFixHeight: false,
            temporaryExpanded: null,
        };
        const core = ValueMap.createCore(coreObj);
        return new Foldable(core);
    }
    get styleExpanded() {
        var _a;
        return (_a = this.get('temporaryExpanded')) !== null && _a !== void 0 ? _a : this.get('expanded');
    }
    get styleHeight() {
        if (!this.styleExpanded) {
            return '0';
        }
        const exHeight = this.get('expandedHeight');
        if (this.get('shouldFixHeight') && !isEmpty(exHeight)) {
            return `${exHeight}px`;
        }
        return 'auto';
    }
    bindExpandedClass(elem, expandedClassName) {
        const onExpand = () => {
            const expanded = this.styleExpanded;
            if (expanded) {
                elem.classList.add(expandedClassName);
            }
            else {
                elem.classList.remove(expandedClassName);
            }
        };
        bindValueMap(this, 'expanded', onExpand);
        bindValueMap(this, 'temporaryExpanded', onExpand);
    }
    cleanUpTransition() {
        this.set('shouldFixHeight', false);
        this.set('expandedHeight', null);
        this.set('completed', true);
    }
}
function computeExpandedFolderHeight(folder, containerElement) {
    let height = 0;
    disableTransitionTemporarily(containerElement, () => {
        // Expand folder temporarily
        folder.set('expandedHeight', null);
        folder.set('temporaryExpanded', true);
        forceReflow(containerElement);
        // Compute height
        height = containerElement.clientHeight;
        // Restore expanded
        folder.set('temporaryExpanded', null);
        forceReflow(containerElement);
    });
    return height;
}
function applyHeight(foldable, elem) {
    elem.style.height = foldable.styleHeight;
}
export function bindFoldable(foldable, elem) {
    foldable.value('expanded').emitter.on('beforechange', () => {
        foldable.set('completed', false);
        if (isEmpty(foldable.get('expandedHeight'))) {
            const h = computeExpandedFolderHeight(foldable, elem);
            if (h > 0) {
                foldable.set('expandedHeight', h);
            }
        }
        foldable.set('shouldFixHeight', true);
        forceReflow(elem);
    });
    foldable.emitter.on('change', () => {
        applyHeight(foldable, elem);
    });
    applyHeight(foldable, elem);
    elem.addEventListener('transitionend', (ev) => {
        if (ev.propertyName !== 'height') {
            return;
        }
        foldable.cleanUpTransition();
    });
}
