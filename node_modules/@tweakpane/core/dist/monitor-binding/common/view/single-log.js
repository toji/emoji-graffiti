import { ClassName } from '../../../common/view/class-name.js';
const cn = ClassName('sgl');
/**
 * @hidden
 */
export class SingleLogView {
    constructor(doc, config) {
        this.onValueUpdate_ = this.onValueUpdate_.bind(this);
        this.formatter_ = config.formatter;
        this.element = doc.createElement('div');
        this.element.classList.add(cn());
        config.viewProps.bindClassModifiers(this.element);
        const inputElem = doc.createElement('input');
        inputElem.classList.add(cn('i'));
        inputElem.readOnly = true;
        inputElem.type = 'text';
        config.viewProps.bindDisabled(inputElem);
        this.element.appendChild(inputElem);
        this.inputElement = inputElem;
        config.value.emitter.on('change', this.onValueUpdate_);
        this.value = config.value;
        this.update_();
    }
    update_() {
        const values = this.value.rawValue;
        const lastValue = values[values.length - 1];
        this.inputElement.value =
            lastValue !== undefined ? this.formatter_(lastValue) : '';
    }
    onValueUpdate_() {
        this.update_();
    }
}
