import { Constraint } from '../constraint/constraint.js';
import { MicroParsers } from '../micro-parsers.js';
import { PointDimensionParams } from '../params.js';
export declare function createPointDimensionParser(p: typeof MicroParsers): {
    format: import("../micro-parsers.js").MicroParser<import("../converter/formatter.js").Formatter<number>>;
    keyScale: import("../micro-parsers.js").MicroParser<number>;
    max: import("../micro-parsers.js").MicroParser<number>;
    min: import("../micro-parsers.js").MicroParser<number>;
    pointerScale: import("../micro-parsers.js").MicroParser<number>;
    step: import("../micro-parsers.js").MicroParser<number>;
};
export declare function parsePointDimensionParams(value: unknown): PointDimensionParams | undefined;
export declare function createDimensionConstraint(params: PointDimensionParams | undefined, initialValue: number): Constraint<number> | undefined;
