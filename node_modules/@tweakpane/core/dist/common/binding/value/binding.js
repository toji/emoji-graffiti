import { isObject } from '../../../misc/type-util.js';
import { isBinding } from '../binding.js';
export function isBindingValue(v) {
    if (!isObject(v) || !('binding' in v)) {
        return false;
    }
    const b = v.binding;
    return isBinding(b);
}
