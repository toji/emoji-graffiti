import { Binding, BindingReader, BindingWriter } from './binding.js';
import { BindingTarget } from './target.js';
/**
 * @hidden
 */
interface Config<T> {
    reader: BindingReader<T>;
    target: BindingTarget;
    writer: BindingWriter<T>;
}
/**
 * A binding that can read and write the target.
 * @hidden
 * @template In The type of the internal value.
 */
export declare class ReadWriteBinding<In> implements Binding {
    readonly target: BindingTarget;
    private readonly reader_;
    private readonly writer_;
    constructor(config: Config<In>);
    read(): In;
    write(value: In): void;
    inject(value: unknown): void;
}
export {};
