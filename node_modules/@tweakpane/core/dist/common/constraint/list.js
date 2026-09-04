import { ValueMap } from '../model/value-map.js';
/**
 * A list constranit.
 * @template T The type of the value.
 */
export class ListConstraint {
    constructor(options) {
        this.values = ValueMap.fromObject({
            options: options,
        });
    }
    constrain(value) {
        const opts = this.values.get('options');
        if (opts.length === 0) {
            return value;
        }
        const matched = opts.filter((item) => {
            return item.value === value;
        }).length > 0;
        return matched ? value : opts[0].value;
    }
}
