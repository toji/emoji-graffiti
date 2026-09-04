import { Constraint } from '../constraint/constraint.js';
import { Formatter } from '../converter/formatter.js';
import { MicroParser, MicroParsers } from '../micro-parsers.js';
import { NumberTextInputParams } from '../params.js';
import { NumberTextPropsObject } from './view/number-text.js';
export declare function mapRange(value: number, start1: number, end1: number, start2: number, end2: number): number;
export declare function getDecimalDigits(value: number): number;
export declare function constrainRange(value: number, min: number, max: number): number;
export declare function loopRange(value: number, max: number): number;
export declare function getSuitableDecimalDigits(params: NumberTextInputParams, rawValue: number): number;
export declare function getSuitableKeyScale(params: NumberTextInputParams): number;
export declare function getSuitablePointerScale(params: NumberTextInputParams, rawValue: number): number;
/**
 * Tries to create a step constraint.
 * @param params The input parameters object.
 * @return A constraint or null if not found.
 */
export declare function createStepConstraint(params: {
    step?: number;
}, initialValue?: number): Constraint<number> | null;
/**
 * Tries to create a range constraint.
 * @param params The input parameters object.
 * @return A constraint or null if not found.
 */
export declare function createRangeConstraint(params: {
    max?: number;
    min?: number;
}): Constraint<number> | null;
export declare function createNumberTextPropsObject(params: NumberTextInputParams, initialValue: number): NumberTextPropsObject;
export declare function createNumberTextInputParamsParser(p: typeof MicroParsers): {
    format: MicroParser<Formatter<number>>;
    keyScale: MicroParser<number>;
    max: MicroParser<number>;
    min: MicroParser<number>;
    pointerScale: MicroParser<number>;
    step: MicroParser<number>;
};
