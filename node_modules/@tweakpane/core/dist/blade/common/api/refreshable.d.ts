export interface Refreshable {
    /**
     * Refreshes the target.
     */
    refresh(): void;
}
export declare function isRefreshable(value: unknown): value is Refreshable;
