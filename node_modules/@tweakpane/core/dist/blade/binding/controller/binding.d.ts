import { BindingValue } from '../../../common/binding/value/binding.js';
import { ValueController } from '../../../common/controller/value.js';
import { BladeController } from '../../common/controller/blade.js';
import { BladeState } from '../../common/controller/blade-state.js';
import { LabeledValueBladeConfig, LabeledValueBladeController } from '../../label/controller/value.js';
/**
 * @hidden
 */
interface Config<In, Vc extends ValueController<In>, Va extends BindingValue<In>> extends LabeledValueBladeConfig<In, Vc, Va> {
    tag?: string | undefined;
}
/**
 * @hidden
 */
export declare class BindingController<In = unknown, Vc extends ValueController<In> = ValueController<In>, Va extends BindingValue<In> = BindingValue<In>> extends LabeledValueBladeController<In, Vc, Va> {
    tag: string | undefined;
    constructor(doc: Document, config: Config<In, Vc, Va>);
    importState(state: BladeState): boolean;
    exportState(): BladeState;
}
export declare function isBindingController(bc: BladeController): bc is BindingController;
export {};
