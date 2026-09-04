import { isEmpty } from '../../../misc/type-util.js';
export class Point4d {
    constructor(x = 0, y = 0, z = 0, w = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }
    getComponents() {
        return [this.x, this.y, this.z, this.w];
    }
    static isObject(obj) {
        if (isEmpty(obj)) {
            return false;
        }
        const x = obj.x;
        const y = obj.y;
        const z = obj.z;
        const w = obj.w;
        if (typeof x !== 'number' ||
            typeof y !== 'number' ||
            typeof z !== 'number' ||
            typeof w !== 'number') {
            return false;
        }
        return true;
    }
    static equals(v1, v2) {
        return v1.x === v2.x && v1.y === v2.y && v1.z === v2.z && v1.w === v2.w;
    }
    toObject() {
        return {
            x: this.x,
            y: this.y,
            z: this.z,
            w: this.w,
        };
    }
}
export const Point4dAssembly = {
    toComponents: (p) => p.getComponents(),
    fromComponents: (comps) => new Point4d(...comps),
};
