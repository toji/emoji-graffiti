import { ClassName } from '../../../common/view/class-name.js';
import { constrainRange, mapRange } from '../util.js';
const cn = ClassName('sld');
/**
 * @hidden
 */
export class SliderView {
    constructor(doc, config) {
        this.onChange_ = this.onChange_.bind(this);
        this.props_ = config.props;
        this.props_.emitter.on('change', this.onChange_);
        this.element = doc.createElement('div');
        this.element.classList.add(cn());
        config.viewProps.bindClassModifiers(this.element);
        const trackElem = doc.createElement('div');
        trackElem.classList.add(cn('t'));
        config.viewProps.bindTabIndex(trackElem);
        this.element.appendChild(trackElem);
        this.trackElement = trackElem;
        const knobElem = doc.createElement('div');
        knobElem.classList.add(cn('k'));
        this.trackElement.appendChild(knobElem);
        this.knobElement = knobElem;
        config.value.emitter.on('change', this.onChange_);
        this.value = config.value;
        this.update_();
    }
    update_() {
        const p = constrainRange(mapRange(this.value.rawValue, this.props_.get('min'), this.props_.get('max'), 0, 100), 0, 100);
        this.knobElement.style.width = `${p}%`;
    }
    onChange_() {
        this.update_();
    }
}
