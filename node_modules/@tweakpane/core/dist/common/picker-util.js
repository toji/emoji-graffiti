export function parsePickerLayout(value) {
    if (value === 'inline' || value === 'popup') {
        return value;
    }
    return undefined;
}
