import { bindFoldable, Foldable } from '../../../blade/common/model/foldable.js';
import { PopupController } from '../../../common/controller/popup.js';
import { findNextTarget, supportsTouch } from '../../../common/dom-util.js';
import { ValueMap } from '../../../common/model/value-map.js';
import { connectValues } from '../../../common/model/value-sync.js';
import { createValue } from '../../../common/model/values.js';
import { forceCast } from '../../../misc/type-util.js';
import { PointNdTextController } from '../../common/controller/point-nd-text.js';
import { Point2dAssembly } from '../model/point-2d.js';
import { Point2dView } from '../view/point-2d.js';
import { Point2dPickerController } from './point-2d-picker.js';
/**
 * @hidden
 */
export class Point2dController {
    constructor(doc, config) {
        var _a, _b;
        this.onPopupChildBlur_ = this.onPopupChildBlur_.bind(this);
        this.onPopupChildKeydown_ = this.onPopupChildKeydown_.bind(this);
        this.onPadButtonBlur_ = this.onPadButtonBlur_.bind(this);
        this.onPadButtonClick_ = this.onPadButtonClick_.bind(this);
        this.value = config.value;
        this.viewProps = config.viewProps;
        this.foldable_ = Foldable.create(config.expanded);
        this.popC_ =
            config.pickerLayout === 'popup'
                ? new PopupController(doc, {
                    viewProps: this.viewProps,
                })
                : null;
        const padC = new Point2dPickerController(doc, {
            layout: config.pickerLayout,
            props: new ValueMap({
                invertsY: createValue(config.invertsY),
                max: createValue(config.max),
                xKeyScale: config.axes[0].textProps.value('keyScale'),
                yKeyScale: config.axes[1].textProps.value('keyScale'),
            }),
            value: this.value,
            viewProps: this.viewProps,
        });
        padC.view.allFocusableElements.forEach((elem) => {
            elem.addEventListener('blur', this.onPopupChildBlur_);
            elem.addEventListener('keydown', this.onPopupChildKeydown_);
        });
        this.pickerC_ = padC;
        this.textC_ = new PointNdTextController(doc, {
            assembly: Point2dAssembly,
            axes: config.axes,
            parser: config.parser,
            value: this.value,
            viewProps: this.viewProps,
        });
        this.view = new Point2dView(doc, {
            expanded: this.foldable_.value('expanded'),
            pickerLayout: config.pickerLayout,
            viewProps: this.viewProps,
        });
        this.view.textElement.appendChild(this.textC_.view.element);
        (_a = this.view.buttonElement) === null || _a === void 0 ? void 0 : _a.addEventListener('blur', this.onPadButtonBlur_);
        (_b = this.view.buttonElement) === null || _b === void 0 ? void 0 : _b.addEventListener('click', this.onPadButtonClick_);
        if (this.popC_) {
            this.view.element.appendChild(this.popC_.view.element);
            this.popC_.view.element.appendChild(this.pickerC_.view.element);
            connectValues({
                primary: this.foldable_.value('expanded'),
                secondary: this.popC_.shows,
                forward: (p) => p,
                backward: (_, s) => s,
            });
        }
        else if (this.view.pickerElement) {
            this.view.pickerElement.appendChild(this.pickerC_.view.element);
            bindFoldable(this.foldable_, this.view.pickerElement);
        }
    }
    get textController() {
        return this.textC_;
    }
    onPadButtonBlur_(e) {
        if (!this.popC_) {
            return;
        }
        const elem = this.view.element;
        const nextTarget = forceCast(e.relatedTarget);
        if (!nextTarget || !elem.contains(nextTarget)) {
            this.popC_.shows.rawValue = false;
        }
    }
    onPadButtonClick_() {
        this.foldable_.set('expanded', !this.foldable_.get('expanded'));
        if (this.foldable_.get('expanded')) {
            this.pickerC_.view.allFocusableElements[0].focus();
        }
    }
    onPopupChildBlur_(ev) {
        if (!this.popC_) {
            return;
        }
        const elem = this.popC_.view.element;
        const nextTarget = findNextTarget(ev);
        if (nextTarget && elem.contains(nextTarget)) {
            // Next target is in the popup
            return;
        }
        if (nextTarget &&
            nextTarget === this.view.buttonElement &&
            !supportsTouch(elem.ownerDocument)) {
            // Next target is the trigger button
            return;
        }
        this.popC_.shows.rawValue = false;
    }
    onPopupChildKeydown_(ev) {
        if (this.popC_) {
            if (ev.key === 'Escape') {
                this.popC_.shows.rawValue = false;
            }
        }
        else if (this.view.pickerElement) {
            if (ev.key === 'Escape') {
                this.view.buttonElement.focus();
            }
        }
    }
}
