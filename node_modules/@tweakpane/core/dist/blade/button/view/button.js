import { ClassName } from '../../../common/view/class-name.js';
import { bindValueToTextContent } from '../../../common/view/reactive.js';
const cn = ClassName('btn');
/**
 * @hidden
 */
export class ButtonView {
    constructor(doc, config) {
        this.element = doc.createElement('div');
        this.element.classList.add(cn());
        config.viewProps.bindClassModifiers(this.element);
        const buttonElem = doc.createElement('button');
        buttonElem.classList.add(cn('b'));
        config.viewProps.bindDisabled(buttonElem);
        this.element.appendChild(buttonElem);
        this.buttonElement = buttonElem;
        const titleElem = doc.createElement('div');
        titleElem.classList.add(cn('t'));
        bindValueToTextContent(config.props.value('title'), titleElem);
        this.buttonElement.appendChild(titleElem);
    }
}
