import { Formatter } from './formatter.js';
export declare function parseNumber(text: string): number | null;
export declare function numberFromUnknown(value: unknown): number;
export declare function numberToString(value: number): string;
export declare function createNumberFormatter(digits: number): Formatter<number>;
