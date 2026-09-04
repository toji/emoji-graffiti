import { ValueController } from '../../../common/controller/value.js';
import { Value } from '../../../common/model/value.js';
import { ViewProps } from '../../../common/model/view-props.js';
import { CheckboxView } from '../view/checkbox.js';
/**
 * @hidden
 */
interface Config {
    value: Value<boolean>;
    viewProps: ViewProps;
}
/**
 * @hidden
 */
export declare class CheckboxController implements ValueController<boolean, CheckboxView> {
    readonly value: Value<boolean>;
    readonly view: CheckboxView;
    readonly viewProps: ViewProps;
    constructor(doc: Document, config: Config);
    private onInputChange_;
    private onLabelMouseDown_;
}
export {};
