import { isEmpty } from '../../misc/type-util.js';
import { ValueMap } from '../model/value-map.js';
/**
 * A number range constraint.
 */
export class RangeConstraint {
    constructor(config) {
        this.values = ValueMap.fromObject({
            max: config.max,
            min: config.min,
        });
    }
    constrain(value) {
        const max = this.values.get('max');
        const min = this.values.get('min');
        let result = value;
        if (!isEmpty(min)) {
            result = Math.max(result, min);
        }
        if (!isEmpty(max)) {
            result = Math.min(result, max);
        }
        return result;
    }
}
