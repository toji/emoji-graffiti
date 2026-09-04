/**
 * Synchronizes two values.
 */
export function connectValues({ primary, secondary, forward, backward, }) {
    // Prevents an event firing loop
    // e.g.
    // primary changed
    // -> applies changes to secondary
    // -> secondary changed
    // -> applies changes to primary
    // -> ...
    let changing = false;
    function preventFeedback(callback) {
        if (changing) {
            return;
        }
        changing = true;
        callback();
        changing = false;
    }
    primary.emitter.on('change', (ev) => {
        preventFeedback(() => {
            secondary.setRawValue(forward(primary.rawValue, secondary.rawValue), ev.options);
        });
    });
    secondary.emitter.on('change', (ev) => {
        preventFeedback(() => {
            primary.setRawValue(backward(primary.rawValue, secondary.rawValue), ev.options);
        });
        // Re-update secondary value
        // to apply change from constraint of primary value
        preventFeedback(() => {
            secondary.setRawValue(forward(primary.rawValue, secondary.rawValue), ev.options);
        });
    });
    preventFeedback(() => {
        secondary.setRawValue(forward(primary.rawValue, secondary.rawValue), {
            forceEmit: false,
            last: true,
        });
    });
}
