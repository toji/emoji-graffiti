import { exportBladeState, importBladeState, } from '../../../blade/common/controller/blade-state.js';
import { ValueMap } from '../../model/value-map.js';
import { createValue } from '../../model/values.js';
import { SliderTextView } from '../view/slider-text.js';
import { NumberTextController } from './number-text.js';
import { SliderController } from './slider.js';
/**
 * @hidden
 */
export class SliderTextController {
    constructor(doc, config) {
        this.value = config.value;
        this.viewProps = config.viewProps;
        this.sliderC_ = new SliderController(doc, {
            props: config.sliderProps,
            value: config.value,
            viewProps: this.viewProps,
        });
        this.textC_ = new NumberTextController(doc, {
            parser: config.parser,
            props: config.textProps,
            sliderProps: config.sliderProps,
            value: config.value,
            viewProps: config.viewProps,
        });
        this.view = new SliderTextView(doc, {
            sliderView: this.sliderC_.view,
            textView: this.textC_.view,
        });
    }
    get sliderController() {
        return this.sliderC_;
    }
    get textController() {
        return this.textC_;
    }
    importProps(state) {
        return importBladeState(state, null, (p) => ({
            max: p.required.number,
            min: p.required.number,
        }), (result) => {
            const sliderProps = this.sliderC_.props;
            sliderProps.set('max', result.max);
            sliderProps.set('min', result.min);
            return true;
        });
    }
    exportProps() {
        const sliderProps = this.sliderC_.props;
        return exportBladeState(null, {
            max: sliderProps.get('max'),
            min: sliderProps.get('min'),
        });
    }
}
export function createSliderTextProps(config) {
    return {
        sliderProps: new ValueMap({
            keyScale: config.keyScale,
            max: config.max,
            min: config.min,
        }),
        textProps: new ValueMap({
            formatter: createValue(config.formatter),
            keyScale: config.keyScale,
            pointerScale: createValue(config.pointerScale),
        }),
    };
}
