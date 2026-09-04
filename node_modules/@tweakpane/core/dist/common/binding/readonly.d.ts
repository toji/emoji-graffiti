import { Binding, BindingReader } from './binding.js';
import { BindingTarget } from './target.js';
/**
 * @hidden
 */
interface Config<T> {
    reader: BindingReader<T>;
    target: BindingTarget;
}
/**
 * A binding that can read the target.
 * @hidden
 * @template In The type of the internal value.
 */
export declare class ReadonlyBinding<In> implements Binding {
    readonly target: BindingTarget;
    private readonly reader_;
    constructor(config: Config<In>);
    read(): In;
}
export {};
