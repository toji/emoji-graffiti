import { forceCast, isEmpty } from '../../misc/type-util.js';
import { TextView } from '../view/text.js';
/**
 * @hidden
 */
export class TextController {
    constructor(doc, config) {
        this.onInputChange_ = this.onInputChange_.bind(this);
        this.parser_ = config.parser;
        this.props = config.props;
        this.value = config.value;
        this.viewProps = config.viewProps;
        this.view = new TextView(doc, {
            props: config.props,
            value: this.value,
            viewProps: this.viewProps,
        });
        this.view.inputElement.addEventListener('change', this.onInputChange_);
    }
    onInputChange_(e) {
        const inputElem = forceCast(e.currentTarget);
        const value = inputElem.value;
        const parsedValue = this.parser_(value);
        if (!isEmpty(parsedValue)) {
            this.value.rawValue = parsedValue;
        }
        this.view.refresh();
    }
}
