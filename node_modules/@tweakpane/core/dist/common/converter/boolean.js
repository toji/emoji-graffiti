export function boolToString(value) {
    return String(value);
}
export function boolFromUnknown(value) {
    if (value === 'false') {
        return false;
    }
    return !!value;
}
export function BooleanFormatter(value) {
    return boolToString(value);
}
