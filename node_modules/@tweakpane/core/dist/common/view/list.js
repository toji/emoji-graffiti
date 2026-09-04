import { createSvgIconElement, removeChildElements } from '../dom-util.js';
import { bindValueMap } from '../model/reactive.js';
import { ClassName } from './class-name.js';
const cn = ClassName('lst');
/**
 * @hidden
 */
export class ListView {
    constructor(doc, config) {
        this.onValueChange_ = this.onValueChange_.bind(this);
        this.props_ = config.props;
        this.element = doc.createElement('div');
        this.element.classList.add(cn());
        config.viewProps.bindClassModifiers(this.element);
        const selectElem = doc.createElement('select');
        selectElem.classList.add(cn('s'));
        config.viewProps.bindDisabled(selectElem);
        this.element.appendChild(selectElem);
        this.selectElement = selectElem;
        const markElem = doc.createElement('div');
        markElem.classList.add(cn('m'));
        markElem.appendChild(createSvgIconElement(doc, 'dropdown'));
        this.element.appendChild(markElem);
        config.value.emitter.on('change', this.onValueChange_);
        this.value_ = config.value;
        bindValueMap(this.props_, 'options', (opts) => {
            removeChildElements(this.selectElement);
            opts.forEach((item) => {
                const optionElem = doc.createElement('option');
                optionElem.textContent = item.text;
                this.selectElement.appendChild(optionElem);
            });
            this.update_();
        });
    }
    update_() {
        const values = this.props_.get('options').map((o) => o.value);
        this.selectElement.selectedIndex = values.indexOf(this.value_.rawValue);
    }
    onValueChange_() {
        this.update_();
    }
}
