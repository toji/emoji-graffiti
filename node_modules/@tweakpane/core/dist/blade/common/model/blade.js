import { ValueMap } from '../../../common/model/value-map.js';
import { createValue } from '../../../common/model/values.js';
import { deepEqualsArray } from '../../../misc/type-util.js';
export function createBlade() {
    return new ValueMap({
        positions: createValue([], {
            equals: deepEqualsArray,
        }),
    });
}
