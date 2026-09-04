import * as assert from 'assert';
export function assertInitialState(api) {
    assert.strictEqual(api.disabled, false);
    assert.strictEqual(api.hidden, false);
    assert.strictEqual(api.controller.viewProps.get('disposed'), false);
}
export function assertDisposes(api) {
    api.dispose();
    assert.strictEqual(api.controller.viewProps.get('disposed'), true);
}
export function assertUpdates(api) {
    api.disabled = true;
    assert.strictEqual(api.disabled, true);
    assert.strictEqual(api.controller.view.element.classList.contains('tp-v-disabled'), true);
    api.hidden = true;
    assert.strictEqual(api.hidden, true);
    assert.strictEqual(api.controller.view.element.classList.contains('tp-v-hidden'), true);
}
