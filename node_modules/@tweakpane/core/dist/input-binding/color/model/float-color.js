import { appendAlphaComponent, constrainColorComponents, convertColor, removeAlphaComponent, } from './color-model.js';
export class FloatColor {
    constructor(comps, mode) {
        this.type = 'float';
        this.mode = mode;
        this.comps_ = constrainColorComponents(comps, mode, this.type);
    }
    getComponents(opt_mode) {
        return appendAlphaComponent(convertColor(removeAlphaComponent(this.comps_), { mode: this.mode, type: this.type }, { mode: opt_mode !== null && opt_mode !== void 0 ? opt_mode : this.mode, type: this.type }), this.comps_[3]);
    }
    toRgbaObject() {
        const rgbComps = this.getComponents('rgb');
        return {
            r: rgbComps[0],
            g: rgbComps[1],
            b: rgbComps[2],
            a: rgbComps[3],
        };
    }
}
