import { ClassName } from '../../../common/view/class-name.js';
const cn = ClassName('tbp');
/**
 * @hidden
 */
export class TabPageView {
    constructor(doc, config) {
        this.element = doc.createElement('div');
        this.element.classList.add(cn());
        config.viewProps.bindClassModifiers(this.element);
        const containerElem = doc.createElement('div');
        containerElem.classList.add(cn('c'));
        this.element.appendChild(containerElem);
        this.containerElement = containerElem;
    }
}
