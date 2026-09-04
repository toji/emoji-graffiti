import { Value } from '../../../common/model/value.js';
import { ValueMap } from '../../../common/model/value-map.js';
/**
 * @hidden
 */
type FoldableObject = {
    completed: boolean;
    expanded: boolean;
    expandedHeight: number | null;
    shouldFixHeight: boolean;
    temporaryExpanded: boolean | null;
};
/**
 * @hidden
 */
export declare class Foldable extends ValueMap<FoldableObject> {
    constructor(valueMap: {
        [Key in keyof FoldableObject]: Value<FoldableObject[Key]>;
    });
    static create(expanded: boolean): Foldable;
    get styleExpanded(): boolean;
    get styleHeight(): string;
    bindExpandedClass(elem: HTMLElement, expandedClassName: string): void;
    cleanUpTransition(): void;
}
export declare function bindFoldable(foldable: Foldable, elem: HTMLElement): void;
export {};
