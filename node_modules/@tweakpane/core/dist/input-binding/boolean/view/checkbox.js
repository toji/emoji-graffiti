import { createSvgIconElement } from '../../../common/dom-util.js';
import { ClassName } from '../../../common/view/class-name.js';
const cn = ClassName('ckb');
/**
 * @hidden
 */
export class CheckboxView {
    constructor(doc, config) {
        this.onValueChange_ = this.onValueChange_.bind(this);
        this.element = doc.createElement('div');
        this.element.classList.add(cn());
        config.viewProps.bindClassModifiers(this.element);
        const labelElem = doc.createElement('label');
        labelElem.classList.add(cn('l'));
        this.element.appendChild(labelElem);
        this.labelElement = labelElem;
        const inputElem = doc.createElement('input');
        inputElem.classList.add(cn('i'));
        inputElem.type = 'checkbox';
        this.labelElement.appendChild(inputElem);
        this.inputElement = inputElem;
        config.viewProps.bindDisabled(this.inputElement);
        const wrapperElem = doc.createElement('div');
        wrapperElem.classList.add(cn('w'));
        this.labelElement.appendChild(wrapperElem);
        const markElem = createSvgIconElement(doc, 'check');
        wrapperElem.appendChild(markElem);
        config.value.emitter.on('change', this.onValueChange_);
        this.value = config.value;
        this.update_();
    }
    update_() {
        this.inputElement.checked = this.value.rawValue;
    }
    onValueChange_() {
        this.update_();
    }
}
