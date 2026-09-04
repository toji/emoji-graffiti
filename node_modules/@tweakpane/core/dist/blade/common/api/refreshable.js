import { isObject } from '../../../misc/type-util.js';
export function isRefreshable(value) {
    if (!isObject(value)) {
        return false;
    }
    return 'refresh' in value && typeof value.refresh === 'function';
}
