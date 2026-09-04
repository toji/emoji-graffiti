import { forceCast } from '../../../misc/type-util.js';
import { CheckboxView } from '../view/checkbox.js';
/**
 * @hidden
 */
export class CheckboxController {
    constructor(doc, config) {
        this.onInputChange_ = this.onInputChange_.bind(this);
        this.onLabelMouseDown_ = this.onLabelMouseDown_.bind(this);
        this.value = config.value;
        this.viewProps = config.viewProps;
        this.view = new CheckboxView(doc, {
            value: this.value,
            viewProps: this.viewProps,
        });
        this.view.inputElement.addEventListener('change', this.onInputChange_);
        this.view.labelElement.addEventListener('mousedown', this.onLabelMouseDown_);
    }
    onInputChange_(ev) {
        const inputElem = forceCast(ev.currentTarget);
        this.value.rawValue = inputElem.checked;
        ev.preventDefault();
        ev.stopPropagation();
    }
    onLabelMouseDown_(ev) {
        // Prevent unwanted text selection
        // https://github.com/cocopon/tweakpane/issues/545
        ev.preventDefault();
    }
}
