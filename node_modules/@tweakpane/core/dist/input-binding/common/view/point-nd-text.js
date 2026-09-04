import { ClassName } from '../../../common/view/class-name.js';
const cn = ClassName('pndtxt');
/**
 * @hidden
 */
export class PointNdTextView {
    constructor(doc, config) {
        this.textViews = config.textViews;
        this.element = doc.createElement('div');
        this.element.classList.add(cn());
        this.textViews.forEach((v) => {
            const axisElem = doc.createElement('div');
            axisElem.classList.add(cn('a'));
            axisElem.appendChild(v.element);
            this.element.appendChild(axisElem);
        });
    }
}
