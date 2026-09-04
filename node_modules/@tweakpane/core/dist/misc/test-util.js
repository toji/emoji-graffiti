export const TestUtil = {
    createEvent: (win, type, options) => {
        return options
            ? new win.Event(type, options)
            : new win.Event(type);
    },
    createKeyboardEvent: (win, type, options) => {
        return new win.KeyboardEvent(type, options);
    },
    closeTo: (actual, expected, delta) => {
        return Math.abs(actual - expected) < delta;
    },
};
