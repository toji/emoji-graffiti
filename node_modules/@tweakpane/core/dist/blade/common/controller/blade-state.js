import { parseRecord, } from '../../../common/micro-parsers.js';
import { deepMerge } from '../../../misc/type-util.js';
/**
 * A utility function for importing a blade state.
 * @param state The state object.
 * @param superImport The function to invoke super.import(), or null for no super.
 * @param parser The state micro parser object.
 * @param callback The callback function that will be called when parsing is successful.
 * @return true if parsing is successful.
 */
export function importBladeState(state, superImport, parser, callback) {
    if (superImport && !superImport(state)) {
        return false;
    }
    const result = parseRecord(state, parser);
    return result ? callback(result) : false;
}
/**
 * A utility function for exporting a blade state.
 * @param superExport The function to invoke super.export(), or null for no super.
 * @param thisState The blade state from the current blade.
 * @return An exported object.
 */
export function exportBladeState(superExport, thisState) {
    var _a;
    return deepMerge((_a = superExport === null || superExport === void 0 ? void 0 : superExport()) !== null && _a !== void 0 ? _a : {}, thisState);
}
