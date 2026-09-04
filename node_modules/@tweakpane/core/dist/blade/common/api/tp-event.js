/**
 * A base class for Tweakpane API events.
 * @template Target The event target.
 */
export class TpEvent {
    /**
     * @hidden
     */
    constructor(target) {
        this.target = target;
    }
}
/**
 * An event class for value changes.
 * @template T The type of the value.
 * @template Target The event target.
 */
export class TpChangeEvent extends TpEvent {
    /**
     * @hidden
     */
    constructor(target, value, last) {
        super(target);
        this.value = value;
        this.last = last !== null && last !== void 0 ? last : true;
    }
}
/**
 * An event class for folder.
 * @template Target The event target.
 */
export class TpFoldEvent extends TpEvent {
    /**
     * @hidden
     */
    constructor(target, expanded) {
        super(target);
        this.expanded = expanded;
    }
}
/**
 * An event class for tab selection.
 * @template Target The event target.
 */
export class TpTabSelectEvent extends TpEvent {
    /**
     * @hidden
     */
    constructor(target, index) {
        super(target);
        this.index = index;
    }
}
/**
 * An event class for mouse events.
 * @template Target The event target.
 */
export class TpMouseEvent extends TpEvent {
    /**
     * @hidden
     */
    constructor(target, nativeEvent) {
        super(target);
        this.native = nativeEvent;
    }
}
