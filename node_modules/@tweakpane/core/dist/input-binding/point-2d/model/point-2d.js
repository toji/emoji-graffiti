import { isEmpty } from '../../../misc/type-util.js';
export class Point2d {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    getComponents() {
        return [this.x, this.y];
    }
    static isObject(obj) {
        if (isEmpty(obj)) {
            return false;
        }
        const x = obj.x;
        const y = obj.y;
        if (typeof x !== 'number' || typeof y !== 'number') {
            return false;
        }
        return true;
    }
    static equals(v1, v2) {
        return v1.x === v2.x && v1.y === v2.y;
    }
    toObject() {
        return {
            x: this.x,
            y: this.y,
        };
    }
}
export const Point2dAssembly = {
    toComponents: (p) => p.getComponents(),
    fromComponents: (comps) => new Point2d(...comps),
};
