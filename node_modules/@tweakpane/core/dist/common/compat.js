import { VERSION } from '../version.js';
export function warnDeprecation(info) {
    var _a;
    console.warn([
        `${info.name} is deprecated.`,
        info.alternative ? `use ${info.alternative} instead.` : '',
        (_a = info.postscript) !== null && _a !== void 0 ? _a : '',
    ].join(' '));
}
export function warnMissing(info) {
    console.warn([
        `Missing '${info.key}' of ${info.target} in ${info.place}.`,
        'Please rebuild plugins with the latest core package.',
    ].join(' '));
}
export function isCompatible(ver) {
    if (!ver) {
        // Version 1.x
        return false;
    }
    return ver.major === VERSION.major;
}
