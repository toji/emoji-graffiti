import { ListItem } from '../constraint/list.js';
import { Value } from '../model/value.js';
import { ValueMap } from '../model/value-map.js';
import { ViewProps } from '../model/view-props.js';
import { View } from './view.js';
/**
 * @hidden
 */
export type ListProps<T> = ValueMap<{
    options: ListItem<T>[];
}>;
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
export declare class ListView<T> implements View {
    readonly selectElement: HTMLSelectElement;
    readonly element: HTMLElement;
    private readonly value_;
    private readonly props_;
    constructor(doc: Document, config: Config<T>);
    private update_;
    private onValueChange_;
}
export {};
