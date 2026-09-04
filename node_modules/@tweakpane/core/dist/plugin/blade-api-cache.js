/**
 * A cache that maps blade controllers and APIs.
 * @hidden
 */
export class BladeApiCache {
    constructor() {
        this.map_ = new Map();
    }
    get(bc) {
        var _a;
        return (_a = this.map_.get(bc)) !== null && _a !== void 0 ? _a : null;
    }
    has(bc) {
        return this.map_.has(bc);
    }
    add(bc, api) {
        this.map_.set(bc, api);
        bc.viewProps.handleDispose(() => {
            this.map_.delete(bc);
        });
        return api;
    }
}
