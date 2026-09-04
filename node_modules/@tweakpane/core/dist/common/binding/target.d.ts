export type Bindable = Record<string, any>;
/**
 * A binding target.
 */
export declare class BindingTarget {
    /**
     * The property name of the binding.
     */
    readonly key: string;
    private readonly obj_;
    /**
     * @hidden
     */
    constructor(obj: Bindable, key: string);
    static isBindable(obj: unknown): obj is Bindable;
    /**
     * Read a bound value.
     * @return A bound value
     */
    read(): unknown;
    /**
     * Write a value.
     * @param value The value to write to the target.
     */
    write(value: unknown): void;
    /**
     * Write a value to the target property.
     * @param name The property name.
     * @param value The value to write to the target.
     */
    writeProperty(name: string, value: unknown): void;
}
