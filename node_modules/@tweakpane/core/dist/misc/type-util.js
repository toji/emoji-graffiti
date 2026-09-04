export function forceCast(v) {
    return v;
}
export function isEmpty(value) {
    return value === null || value === undefined;
}
export function isObject(value) {
    return value !== null && typeof value === 'object';
}
export function isRecord(value) {
    return value !== null && typeof value === 'object';
}
export function deepEqualsArray(a1, a2) {
    if (a1.length !== a2.length) {
        return false;
    }
    for (let i = 0; i < a1.length; i++) {
        if (a1[i] !== a2[i]) {
            return false;
        }
    }
    return true;
}
export function isPropertyWritable(obj, key) {
    let target = obj;
    do {
        const d = Object.getOwnPropertyDescriptor(target, key);
        if (d && (d.set !== undefined || d.writable === true)) {
            return true;
        }
        target = Object.getPrototypeOf(target);
    } while (target !== null);
    return false;
}
export function deepMerge(r1, r2) {
    const keys = Array.from(new Set([...Object.keys(r1), ...Object.keys(r2)]));
    return keys.reduce((result, key) => {
        const v1 = r1[key];
        const v2 = r2[key];
        return isRecord(v1) && isRecord(v2)
            ? Object.assign(Object.assign({}, result), { [key]: deepMerge(v1, v2) }) : Object.assign(Object.assign({}, result), { [key]: key in r2 ? v2 : v1 });
    }, {});
}
