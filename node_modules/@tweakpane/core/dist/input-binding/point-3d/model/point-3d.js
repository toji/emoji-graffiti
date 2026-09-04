import { isEmpty } from '../../../misc/type-util.js';
export class Point3d {
    constructor(x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    getComponents() {
        return [this.x, this.y, this.z];
    }
    static isObject(obj) {
        if (isEmpty(obj)) {
            return false;
        }
        const x = obj.x;
        const y = obj.y;
        const z = obj.z;
        if (typeof x !== 'number' ||
            typeof y !== 'number' ||
            typeof z !== 'number') {
            return false;
        }
        return true;
    }
    static equals(v1, v2) {
        return v1.x === v2.x && v1.y === v2.y && v1.z === v2.z;
    }
    toObject() {
        return {
            x: this.x,
            y: this.y,
            z: this.z,
        };
    }
}
export const Point3dAssembly = {
    toComponents: (p) => p.getComponents(),
    fromComponents: (comps) => new Point3d(...comps),
};
