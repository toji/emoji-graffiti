import { Emitter } from '../../../common/model/emitter.js';
import { TpError } from '../../../common/tp-error.js';
import { isContainerBladeController } from '../controller/container-blade.js';
import { isValueBladeController } from '../controller/value-blade.js';
import { NestedOrderedSet, } from './nested-ordered-set.js';
function findValueBladeController(bcs, v) {
    for (let i = 0; i < bcs.length; i++) {
        const bc = bcs[i];
        if (isValueBladeController(bc) && bc.value === v) {
            return bc;
        }
    }
    return null;
}
function findSubBladeControllerSet(bc) {
    return isContainerBladeController(bc)
        ? bc.rackController.rack['bcSet_']
        : null;
}
/**
 * A collection of blade controllers that manages positions and event propagation.
 * @hidden
 */
export class Rack {
    constructor(config) {
        var _a, _b;
        this.emitter = new Emitter();
        this.onBladePositionsChange_ = this.onBladePositionsChange_.bind(this);
        this.onSetAdd_ = this.onSetAdd_.bind(this);
        this.onSetRemove_ = this.onSetRemove_.bind(this);
        this.onChildDispose_ = this.onChildDispose_.bind(this);
        this.onChildPositionsChange_ = this.onChildPositionsChange_.bind(this);
        this.onChildValueChange_ = this.onChildValueChange_.bind(this);
        this.onChildViewPropsChange_ = this.onChildViewPropsChange_.bind(this);
        this.onRackLayout_ = this.onRackLayout_.bind(this);
        this.onRackValueChange_ = this.onRackValueChange_.bind(this);
        this.blade_ = (_a = config.blade) !== null && _a !== void 0 ? _a : null;
        (_b = this.blade_) === null || _b === void 0 ? void 0 : _b.value('positions').emitter.on('change', this.onBladePositionsChange_);
        this.viewProps = config.viewProps;
        this.bcSet_ = new NestedOrderedSet(findSubBladeControllerSet);
        this.bcSet_.emitter.on('add', this.onSetAdd_);
        this.bcSet_.emitter.on('remove', this.onSetRemove_);
    }
    get children() {
        return this.bcSet_.items;
    }
    add(bc, opt_index) {
        var _a;
        (_a = bc.parent) === null || _a === void 0 ? void 0 : _a.remove(bc);
        bc.parent = this;
        this.bcSet_.add(bc, opt_index);
    }
    remove(bc) {
        bc.parent = null;
        this.bcSet_.remove(bc);
    }
    find(finder) {
        return this.bcSet_.allItems().filter(finder);
    }
    onSetAdd_(ev) {
        this.updatePositions_();
        const root = ev.target === ev.root;
        this.emitter.emit('add', {
            bladeController: ev.item,
            index: ev.index,
            root: root,
            sender: this,
        });
        if (!root) {
            return;
        }
        const bc = ev.item;
        bc.viewProps.emitter.on('change', this.onChildViewPropsChange_);
        bc.blade
            .value('positions')
            .emitter.on('change', this.onChildPositionsChange_);
        bc.viewProps.handleDispose(this.onChildDispose_);
        if (isValueBladeController(bc)) {
            bc.value.emitter.on('change', this.onChildValueChange_);
        }
        else if (isContainerBladeController(bc)) {
            const rack = bc.rackController.rack;
            if (rack) {
                const emitter = rack.emitter;
                emitter.on('layout', this.onRackLayout_);
                emitter.on('valuechange', this.onRackValueChange_);
            }
        }
    }
    onSetRemove_(ev) {
        this.updatePositions_();
        const root = ev.target === ev.root;
        this.emitter.emit('remove', {
            bladeController: ev.item,
            root: root,
            sender: this,
        });
        if (!root) {
            return;
        }
        const bc = ev.item;
        if (isValueBladeController(bc)) {
            bc.value.emitter.off('change', this.onChildValueChange_);
        }
        else if (isContainerBladeController(bc)) {
            const rack = bc.rackController.rack;
            if (rack) {
                const emitter = rack.emitter;
                emitter.off('layout', this.onRackLayout_);
                emitter.off('valuechange', this.onRackValueChange_);
            }
        }
    }
    updatePositions_() {
        const visibleItems = this.bcSet_.items.filter((bc) => !bc.viewProps.get('hidden'));
        const firstVisibleItem = visibleItems[0];
        const lastVisibleItem = visibleItems[visibleItems.length - 1];
        this.bcSet_.items.forEach((bc) => {
            const ps = [];
            if (bc === firstVisibleItem) {
                ps.push('first');
                if (!this.blade_ ||
                    this.blade_.get('positions').includes('veryfirst')) {
                    ps.push('veryfirst');
                }
            }
            if (bc === lastVisibleItem) {
                ps.push('last');
                if (!this.blade_ || this.blade_.get('positions').includes('verylast')) {
                    ps.push('verylast');
                }
            }
            bc.blade.set('positions', ps);
        });
    }
    onChildPositionsChange_() {
        this.updatePositions_();
        this.emitter.emit('layout', {
            sender: this,
        });
    }
    onChildViewPropsChange_(_ev) {
        this.updatePositions_();
        this.emitter.emit('layout', {
            sender: this,
        });
    }
    onChildDispose_() {
        const disposedUcs = this.bcSet_.items.filter((bc) => {
            return bc.viewProps.get('disposed');
        });
        disposedUcs.forEach((bc) => {
            this.bcSet_.remove(bc);
        });
    }
    onChildValueChange_(ev) {
        const bc = findValueBladeController(this.find(isValueBladeController), ev.sender);
        if (!bc) {
            throw TpError.alreadyDisposed();
        }
        this.emitter.emit('valuechange', {
            bladeController: bc,
            options: ev.options,
            sender: this,
        });
    }
    onRackLayout_(_) {
        this.updatePositions_();
        this.emitter.emit('layout', {
            sender: this,
        });
    }
    onRackValueChange_(ev) {
        this.emitter.emit('valuechange', {
            bladeController: ev.bladeController,
            options: ev.options,
            sender: this,
        });
    }
    onBladePositionsChange_() {
        this.updatePositions_();
    }
}
