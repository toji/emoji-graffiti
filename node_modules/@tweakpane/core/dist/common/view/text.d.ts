import { Formatter } from '../converter/formatter.js';
import { Value } from '../model/value.js';
import { ValueMap } from '../model/value-map.js';
import { ViewProps } from '../model/view-props.js';
import { InputView, View } from './view.js';
/**
 * @hidden
 */
export type TextProps<T> = ValueMap<{
    formatter: Formatter<T>;
}>;
/**
 * @hidden
 */
interface Config<T> {
    props: TextProps<T>;
    value: Value<T>;
    viewProps: ViewProps;
}
/**
 * @hidden
 */
export declare class TextView<T> implements View, InputView {
    readonly inputElement: HTMLInputElement;
    readonly element: HTMLElement;
    private readonly props_;
    private readonly value_;
    constructor(doc: Document, config: Config<T>);
    refresh(): void;
    private onChange_;
}
export {};
