import { Formatter } from '../../../common/converter/formatter.js';
import { BufferedValue } from '../../../common/model/buffered-value.js';
import { ViewProps } from '../../../common/model/view-props.js';
import { View } from '../../../common/view/view.js';
interface Config<T> {
    formatter: Formatter<T>;
    rows: number;
    value: BufferedValue<T>;
    viewProps: ViewProps;
}
/**
 * @hidden
 */
export declare class MultiLogView<T> implements View {
    readonly element: HTMLElement;
    readonly value: BufferedValue<T>;
    private readonly formatter_;
    private readonly textareaElem_;
    constructor(doc: Document, config: Config<T>);
    private update_;
    private onValueUpdate_;
}
export {};
