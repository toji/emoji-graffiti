import { ValueController } from '../../../common/controller/value.js';
import { LabelController } from '../../../common/label/controller/label.js';
import { LabelProps, LabelView } from '../../../common/label/view/label.js';
import { Value } from '../../../common/model/value.js';
import { BladeController } from '../../common/controller/blade.js';
import { BladeState, PropsPortable } from '../../common/controller/blade-state.js';
import { Blade } from '../../common/model/blade.js';
/**
 * @hidden
 */
interface Config<T, C extends ValueController<T>, Va extends Value<T>> {
    blade: Blade;
    props: LabelProps;
    value: Va;
    valueController: C;
}
/**
 * @hidden
 */
export type LabeledValueBladeConfig<T, C extends ValueController<T>, Va extends Value<T>> = Config<T, C, Va>;
/**
 * @hidden
 */
export declare class LabeledValueBladeController<T, C extends ValueController<T> & Partial<PropsPortable> = ValueController<T>, Va extends Value<T> = Value<T>> extends BladeController<LabelView> implements ValueController<T, LabelView, Va> {
    readonly value: Va;
    readonly labelController: LabelController<C>;
    readonly valueController: C;
    constructor(doc: Document, config: Config<T, C, Va>);
    importState(state: BladeState): boolean;
    exportState(): BladeState;
}
export {};
