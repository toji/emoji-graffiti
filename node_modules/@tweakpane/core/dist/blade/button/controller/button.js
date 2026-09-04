import { Emitter } from '../../../common/model/emitter.js';
import { exportBladeState, importBladeState, } from '../../common/controller/blade-state.js';
import { ButtonView } from '../view/button.js';
/**
 * @hidden
 */
export class ButtonController {
    /**
     * @hidden
     */
    constructor(doc, config) {
        this.emitter = new Emitter();
        this.onClick_ = this.onClick_.bind(this);
        this.props = config.props;
        this.viewProps = config.viewProps;
        this.view = new ButtonView(doc, {
            props: this.props,
            viewProps: this.viewProps,
        });
        this.view.buttonElement.addEventListener('click', this.onClick_);
    }
    importProps(state) {
        return importBladeState(state, null, (p) => ({
            title: p.optional.string,
        }), (result) => {
            this.props.set('title', result.title);
            return true;
        });
    }
    exportProps() {
        return exportBladeState(null, {
            title: this.props.get('title'),
        });
    }
    onClick_(ev) {
        this.emitter.emit('click', {
            nativeEvent: ev,
            sender: this,
        });
    }
}
