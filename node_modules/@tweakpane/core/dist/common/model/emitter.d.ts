type Handler<E> = (ev: E) => void;
/**
 * A type-safe event emitter.
 * @template E The interface that maps event names and event objects.
 */
export declare class Emitter<E> {
    private readonly observers_;
    constructor();
    /**
     * Adds an event listener to the emitter.
     * @param eventName The event name to listen.
     * @param handler The event handler.
     * @param opt_options The options.
     * @param opt_options.key The key that can be used for removing the handler.
     */
    on<EventName extends keyof E>(eventName: EventName, handler: Handler<E[EventName]>, opt_options?: {
        key: unknown;
    }): Emitter<E>;
    /**
     * Removes an event listener from the emitter.
     * @param eventName The event name.
     * @param key The event handler to remove, or the key for removing the handler.
     */
    off<EventName extends keyof E>(eventName: EventName, key: Handler<E[EventName]> | unknown): Emitter<E>;
    emit<EventName extends keyof E>(eventName: EventName, event: E[EventName]): void;
}
export {};
