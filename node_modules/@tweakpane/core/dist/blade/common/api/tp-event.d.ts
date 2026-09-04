/**
 * A base class for Tweakpane API events.
 * @template Target The event target.
 */
export declare class TpEvent<Target = unknown> {
    /**
     * The event dispatcher.
     */
    readonly target: Target;
    /**
     * @hidden
     */
    constructor(target: Target);
}
/**
 * An event class for value changes.
 * @template T The type of the value.
 * @template Target The event target.
 */
export declare class TpChangeEvent<T, Target = unknown> extends TpEvent<Target> {
    /**
     * The value.
     */
    readonly value: T;
    /**
     * The flag indicating whether the event is for the last change.
     */
    readonly last: boolean;
    /**
     * @hidden
     */
    constructor(target: Target, value: T, last?: boolean);
}
/**
 * An event class for folder.
 * @template Target The event target.
 */
export declare class TpFoldEvent<Target> extends TpEvent<Target> {
    /**
     * The current state of the folder expansion.
     */
    readonly expanded: boolean;
    /**
     * @hidden
     */
    constructor(target: Target, expanded: boolean);
}
/**
 * An event class for tab selection.
 * @template Target The event target.
 */
export declare class TpTabSelectEvent<Target> extends TpEvent<Target> {
    /**
     * The selected index of the tab item.
     */
    readonly index: number;
    /**
     * @hidden
     */
    constructor(target: Target, index: number);
}
/**
 * An event class for mouse events.
 * @template Target The event target.
 */
export declare class TpMouseEvent<Target> extends TpEvent<Target> {
    /**
     * The native mouse event.
     */
    readonly native: MouseEvent;
    /**
     * @hidden
     */
    constructor(target: Target, nativeEvent: MouseEvent);
}
