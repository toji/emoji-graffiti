import { ValueMap } from '../model/value-map.js';
import { createNumberTextPropsObject } from '../number/util.js';
export function createPointAxis(config) {
    return {
        constraint: config.constraint,
        textProps: ValueMap.fromObject(createNumberTextPropsObject(config.params, config.initialValue)),
    };
}
