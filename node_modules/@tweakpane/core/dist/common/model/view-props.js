import { ClassName } from '../view/class-name.js';
import { valueToClassName } from '../view/reactive.js';
import { bindValue, bindValueMap } from './reactive.js';
import { ValueMap } from './value-map.js';
import { createReadonlyValue, createValue } from './values.js';
const cn = ClassName('');
function valueToModifier(elem, modifier) {
    return valueToClassName(elem, cn(undefined, modifier));
}
export class ViewProps extends ValueMap {
    /**
     * @hidden
     */
    constructor(valueMap) {
        var _a;
        super(valueMap);
        this.onDisabledChange_ = this.onDisabledChange_.bind(this);
        this.onParentChange_ = this.onParentChange_.bind(this);
        this.onParentGlobalDisabledChange_ =
            this.onParentGlobalDisabledChange_.bind(this);
        [this.globalDisabled_, this.setGlobalDisabled_] = createReadonlyValue(createValue(this.getGlobalDisabled_()));
        this.value('disabled').emitter.on('change', this.onDisabledChange_);
        this.value('parent').emitter.on('change', this.onParentChange_);
        (_a = this.get('parent')) === null || _a === void 0 ? void 0 : _a.globalDisabled.emitter.on('change', this.onParentGlobalDisabledChange_);
    }
    static create(opt_initialValue) {
        var _a, _b, _c;
        const initialValue = opt_initialValue !== null && opt_initialValue !== void 0 ? opt_initialValue : {};
        return new ViewProps(ValueMap.createCore({
            disabled: (_a = initialValue.disabled) !== null && _a !== void 0 ? _a : false,
            disposed: false,
            hidden: (_b = initialValue.hidden) !== null && _b !== void 0 ? _b : false,
            parent: (_c = initialValue.parent) !== null && _c !== void 0 ? _c : null,
        }));
    }
    get globalDisabled() {
        return this.globalDisabled_;
    }
    bindClassModifiers(elem) {
        bindValue(this.globalDisabled_, valueToModifier(elem, 'disabled'));
        bindValueMap(this, 'hidden', valueToModifier(elem, 'hidden'));
    }
    bindDisabled(target) {
        bindValue(this.globalDisabled_, (disabled) => {
            target.disabled = disabled;
        });
    }
    bindTabIndex(elem) {
        bindValue(this.globalDisabled_, (disabled) => {
            elem.tabIndex = disabled ? -1 : 0;
        });
    }
    handleDispose(callback) {
        this.value('disposed').emitter.on('change', (disposed) => {
            if (disposed) {
                callback();
            }
        });
    }
    importState(state) {
        this.set('disabled', state.disabled);
        this.set('hidden', state.hidden);
    }
    exportState() {
        return {
            disabled: this.get('disabled'),
            hidden: this.get('hidden'),
        };
    }
    /**
     * Gets a global disabled of the view.
     * Disabled of the view will be affected by its disabled and its parent disabled.
     */
    getGlobalDisabled_() {
        const parent = this.get('parent');
        const parentDisabled = parent ? parent.globalDisabled.rawValue : false;
        return parentDisabled || this.get('disabled');
    }
    updateGlobalDisabled_() {
        this.setGlobalDisabled_(this.getGlobalDisabled_());
    }
    onDisabledChange_() {
        this.updateGlobalDisabled_();
    }
    onParentGlobalDisabledChange_() {
        this.updateGlobalDisabled_();
    }
    onParentChange_(ev) {
        var _a;
        const prevParent = ev.previousRawValue;
        prevParent === null || prevParent === void 0 ? void 0 : prevParent.globalDisabled.emitter.off('change', this.onParentGlobalDisabledChange_);
        (_a = this.get('parent')) === null || _a === void 0 ? void 0 : _a.globalDisabled.emitter.on('change', this.onParentGlobalDisabledChange_);
        this.updateGlobalDisabled_();
    }
}
