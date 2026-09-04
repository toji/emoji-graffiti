declare const CSS_VAR_MAP: {
    containerUnitSize: string;
};
/**
 * Gets a name of the internal CSS variable.
 * @param key The key for the CSS variable.
 * @return A name of the internal CSS variable.
 */
export declare function getCssVar(key: keyof typeof CSS_VAR_MAP): string;
export {};
