import { ClassName } from '../../../common/view/class-name.js';
const cn = ClassName('sldtxt');
/**
 * @hidden
 */
export class SliderTextView {
    constructor(doc, config) {
        this.element = doc.createElement('div');
        this.element.classList.add(cn());
        const sliderElem = doc.createElement('div');
        sliderElem.classList.add(cn('s'));
        this.sliderView_ = config.sliderView;
        sliderElem.appendChild(this.sliderView_.element);
        this.element.appendChild(sliderElem);
        const textElem = doc.createElement('div');
        textElem.classList.add(cn('t'));
        this.textView_ = config.textView;
        textElem.appendChild(this.textView_.element);
        this.element.appendChild(textElem);
    }
}
