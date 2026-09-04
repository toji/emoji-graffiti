import { mapRange } from '../../../common/number/util.js';
import { ClassName } from '../../../common/view/class-name.js';
import { colorToFunctionalRgbString } from '../converter/color-string.js';
import { IntColor } from '../model/int-color.js';
const cn = ClassName('hpl');
/**
 * @hidden
 */
export class HPaletteView {
    constructor(doc, config) {
        this.onValueChange_ = this.onValueChange_.bind(this);
        this.value = config.value;
        this.value.emitter.on('change', this.onValueChange_);
        this.element = doc.createElement('div');
        this.element.classList.add(cn());
        config.viewProps.bindClassModifiers(this.element);
        config.viewProps.bindTabIndex(this.element);
        const colorElem = doc.createElement('div');
        colorElem.classList.add(cn('c'));
        this.element.appendChild(colorElem);
        const markerElem = doc.createElement('div');
        markerElem.classList.add(cn('m'));
        this.element.appendChild(markerElem);
        this.markerElem_ = markerElem;
        this.update_();
    }
    update_() {
        const c = this.value.rawValue;
        const [h] = c.getComponents('hsv');
        this.markerElem_.style.backgroundColor = colorToFunctionalRgbString(new IntColor([h, 100, 100], 'hsv'));
        const left = mapRange(h, 0, 360, 0, 100);
        this.markerElem_.style.left = `${left}%`;
    }
    onValueChange_() {
        this.update_();
    }
}
