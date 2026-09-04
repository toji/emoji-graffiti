import { exportBladeState, importBladeState, } from '../../blade/common/controller/blade-state.js';
import { forceCast } from '../../misc/type-util.js';
import { normalizeListOptions, parseListOptions } from '../list-util.js';
import { ListView } from '../view/list.js';
/**
 * @hidden
 */
export class ListController {
    constructor(doc, config) {
        this.onSelectChange_ = this.onSelectChange_.bind(this);
        this.props = config.props;
        this.value = config.value;
        this.viewProps = config.viewProps;
        this.view = new ListView(doc, {
            props: this.props,
            value: this.value,
            viewProps: this.viewProps,
        });
        this.view.selectElement.addEventListener('change', this.onSelectChange_);
    }
    onSelectChange_(e) {
        const selectElem = forceCast(e.currentTarget);
        this.value.rawValue =
            this.props.get('options')[selectElem.selectedIndex].value;
    }
    importProps(state) {
        return importBladeState(state, null, (p) => ({
            options: p.required.custom(parseListOptions),
        }), (result) => {
            this.props.set('options', normalizeListOptions(result.options));
            return true;
        });
    }
    exportProps() {
        return exportBladeState(null, {
            options: this.props.get('options'),
        });
    }
}
