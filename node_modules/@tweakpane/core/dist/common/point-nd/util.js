import { isRecord } from '../../misc/type-util.js';
import { CompositeConstraint } from '../constraint/composite.js';
import { parseRecord } from '../micro-parsers.js';
import { createNumberTextInputParamsParser, createRangeConstraint, createStepConstraint, } from '../number/util.js';
export function createPointDimensionParser(p) {
    return createNumberTextInputParamsParser(p);
}
export function parsePointDimensionParams(value) {
    if (!isRecord(value)) {
        return undefined;
    }
    return parseRecord(value, createPointDimensionParser);
}
export function createDimensionConstraint(params, initialValue) {
    if (!params) {
        return undefined;
    }
    const constraints = [];
    const cs = createStepConstraint(params, initialValue);
    if (cs) {
        constraints.push(cs);
    }
    const rs = createRangeConstraint(params);
    if (rs) {
        constraints.push(rs);
    }
    return new CompositeConstraint(constraints);
}
