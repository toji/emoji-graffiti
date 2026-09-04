import { bindValue } from '../model/reactive.js';
import { ClassName } from './class-name.js';
import { valueToClassName } from './reactive.js';
const cn = ClassName('pop');
/**
 * @hidden
 */
export class PopupView {
    constructor(doc, config) {
        this.element = doc.createElement('div');
        this.element.classList.add(cn());
        config.viewProps.bindClassModifiers(this.element);
        bindValue(config.shows, valueToClassName(this.element, cn(undefined, 'v')));
    }
}
