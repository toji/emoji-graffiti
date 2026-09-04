import { BladeState, PropsPortable } from '../../blade/common/controller/blade-state.js';
import { Value } from '../model/value.js';
import { ViewProps } from '../model/view-props.js';
import { ListProps, ListView } from '../view/list.js';
import { ValueController } from './value.js';
/**
 * @hidden
 */
interface Config<T> {
    props: ListProps<T>;
    value: Value<T>;
    viewProps: ViewProps;
}
/**
 * @hidden
 */
export declare class ListController<T> implements ValueController<T, ListView<T>>, PropsPortable {
    readonly value: Value<T>;
    readonly view: ListView<T>;
    readonly props: ListProps<T>;
    readonly viewProps: ViewProps;
    constructor(doc: Document, config: Config<T>);
    private onSelectChange_;
    importProps(state: BladeState): boolean;
    exportProps(): BladeState;
}
export {};
