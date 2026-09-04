import { ClassName } from './class-name.js';
/**
 * @hidden
 */
export class PlainView {
    /**
     * @hidden
     */
    constructor(doc, config) {
        const cn = ClassName(config.viewName);
        this.element = doc.createElement('div');
        this.element.classList.add(cn());
        config.viewProps.bindClassModifiers(this.element);
    }
}
