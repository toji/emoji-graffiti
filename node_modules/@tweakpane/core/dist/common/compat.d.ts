import { Semver } from '../misc/semver.js';
export declare function warnDeprecation(info: {
    name: string;
    alternative?: string;
    postscript?: string;
}): void;
export declare function warnMissing(info: {
    key: string;
    target: string;
    place: string;
}): void;
export declare function isCompatible(ver: Semver | undefined): boolean;
