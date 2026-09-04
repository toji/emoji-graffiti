import { BindingApi } from '../../blade/binding/api/binding.js';
export class ListInputBindingApi extends BindingApi {
    get options() {
        return this.controller.valueController.props.get('options');
    }
    set options(options) {
        this.controller.valueController.props.set('options', options);
    }
}
