import { isObject } from '../../misc/type-util.js';
export function isBinding(value) {
    if (!isObject(value)) {
        return false;
    }
    return 'target' in value;
}
