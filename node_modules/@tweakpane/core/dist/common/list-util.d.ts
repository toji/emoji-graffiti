import { ListConstraint, ListItem } from './constraint/list.js';
import { ArrayStyleListOptions, ListParamsOptions, ObjectStyleListOptions } from './params.js';
export declare function parseListOptions<T>(value: unknown): ListParamsOptions<T> | undefined;
export declare function normalizeListOptions<T>(options: ArrayStyleListOptions<T> | ObjectStyleListOptions<T>): ListItem<T>[];
/**
 * Tries to create a list constraint.
 * @template T The type of the raw value.
 * @param options The list options.
 * @return A constraint or null if not found.
 */
export declare function createListConstraint<T>(options: ListParamsOptions<T> | undefined): ListConstraint<T> | null;
