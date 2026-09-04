import { Parser } from '../converter/parser.js';
import { Value } from '../model/value.js';
import { ViewProps } from '../model/view-props.js';
import { TextProps, TextView } from '../view/text.js';
import { ValueController } from './value.js';
/**
 * @hidden
 */
export interface Config<T> {
    props: TextProps<T>;
    parser: Parser<T>;
    value: Value<T>;
    viewProps: ViewProps;
}
/**
 * @hidden
 */
export declare class TextController<T> implements ValueController<T, TextView<T>> {
    readonly props: TextProps<T>;
    readonly value: Value<T>;
    readonly view: TextView<T>;
    readonly viewProps: ViewProps;
    private readonly parser_;
    constructor(doc: Document, config: Config<T>);
    private onInputChange_;
}
