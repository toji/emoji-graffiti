import { MicroParser, MicroParsers } from '../../../common/micro-parsers.js';
/**
 * A state object for blades.
 */
export type BladeState = Record<string, unknown>;
/**
 * A utility function for importing a blade state.
 * @param state The state object.
 * @param superImport The function to invoke super.import(), or null for no super.
 * @param parser The state micro parser object.
 * @param callback The callback function that will be called when parsing is successful.
 * @return true if parsing is successful.
 */
export declare function importBladeState<O extends BladeState>(state: BladeState, superImport: ((state: BladeState) => boolean) | null, parser: (p: typeof MicroParsers) => {
    [key in keyof O]: MicroParser<O[key]>;
}, callback: (o: O) => boolean): boolean;
/**
 * A utility function for exporting a blade state.
 * @param superExport The function to invoke super.export(), or null for no super.
 * @param thisState The blade state from the current blade.
 * @return An exported object.
 */
export declare function exportBladeState(superExport: (() => BladeState) | null, thisState: BladeState): BladeState;
/**
 * An interface that can import/export a state.
 */
export interface PropsPortable {
    /**
     * Imports props.
     * @param state The state object.
     * @return true if successfully imported.
     */
    importProps: (state: BladeState) => boolean;
    /**
     * Exports props.
     * @return An exported object.
     */
    exportProps: () => BladeState;
}
