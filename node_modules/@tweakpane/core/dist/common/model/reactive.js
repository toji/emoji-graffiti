export function bindValue(value, applyValue) {
    value.emitter.on('change', (ev) => {
        applyValue(ev.rawValue);
    });
    applyValue(value.rawValue);
}
export function bindValueMap(valueMap, key, applyValue) {
    bindValue(valueMap.value(key), applyValue);
}
