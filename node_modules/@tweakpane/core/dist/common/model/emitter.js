/**
 * A type-safe event emitter.
 * @template E The interface that maps event names and event objects.
 */
export class Emitter {
    constructor() {
        this.observers_ = {};
    }
    /**
     * Adds an event listener to the emitter.
     * @param eventName The event name to listen.
     * @param handler The event handler.
     * @param opt_options The options.
     * @param opt_options.key The key that can be used for removing the handler.
     */
    on(eventName, handler, opt_options) {
        var _a;
        let observers = this.observers_[eventName];
        if (!observers) {
            observers = this.observers_[eventName] = [];
        }
        observers.push({
            handler: handler,
            key: (_a = opt_options === null || opt_options === void 0 ? void 0 : opt_options.key) !== null && _a !== void 0 ? _a : handler,
        });
        return this;
    }
    /**
     * Removes an event listener from the emitter.
     * @param eventName The event name.
     * @param key The event handler to remove, or the key for removing the handler.
     */
    off(eventName, key) {
        const observers = this.observers_[eventName];
        if (observers) {
            this.observers_[eventName] = observers.filter((observer) => {
                return observer.key !== key;
            });
        }
        return this;
    }
    emit(eventName, event) {
        const observers = this.observers_[eventName];
        if (!observers) {
            return;
        }
        observers.forEach((observer) => {
            observer.handler(event);
        });
    }
}
