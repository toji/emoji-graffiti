import { exportBladeState, importBladeState, } from '../../../blade/common/controller/blade-state.js';
import { supportsTouch } from '../../../common/dom-util.js';
import { createValue } from '../../../common/model/values.js';
import { mapRange } from '../../../common/number/util.js';
import { PointerHandler, } from '../../../common/view/pointer-handler.js';
import { GraphLogView } from '../view/graph-log.js';
/**
 * @hidden
 */
export class GraphLogController {
    constructor(doc, config) {
        this.onGraphMouseMove_ = this.onGraphMouseMove_.bind(this);
        this.onGraphMouseLeave_ = this.onGraphMouseLeave_.bind(this);
        this.onGraphPointerDown_ = this.onGraphPointerDown_.bind(this);
        this.onGraphPointerMove_ = this.onGraphPointerMove_.bind(this);
        this.onGraphPointerUp_ = this.onGraphPointerUp_.bind(this);
        this.props = config.props;
        this.value = config.value;
        this.viewProps = config.viewProps;
        this.cursor_ = createValue(-1);
        this.view = new GraphLogView(doc, {
            cursor: this.cursor_,
            formatter: config.formatter,
            rows: config.rows,
            props: this.props,
            value: this.value,
            viewProps: this.viewProps,
        });
        if (!supportsTouch(doc)) {
            this.view.element.addEventListener('mousemove', this.onGraphMouseMove_);
            this.view.element.addEventListener('mouseleave', this.onGraphMouseLeave_);
        }
        else {
            const ph = new PointerHandler(this.view.element);
            ph.emitter.on('down', this.onGraphPointerDown_);
            ph.emitter.on('move', this.onGraphPointerMove_);
            ph.emitter.on('up', this.onGraphPointerUp_);
        }
    }
    importProps(state) {
        return importBladeState(state, null, (p) => ({
            max: p.required.number,
            min: p.required.number,
        }), (result) => {
            this.props.set('max', result.max);
            this.props.set('min', result.min);
            return true;
        });
    }
    exportProps() {
        return exportBladeState(null, {
            max: this.props.get('max'),
            min: this.props.get('min'),
        });
    }
    onGraphMouseLeave_() {
        this.cursor_.rawValue = -1;
    }
    onGraphMouseMove_(ev) {
        const { clientWidth: w } = this.view.element;
        this.cursor_.rawValue = Math.floor(mapRange(ev.offsetX, 0, w, 0, this.value.rawValue.length));
    }
    onGraphPointerDown_(ev) {
        this.onGraphPointerMove_(ev);
    }
    onGraphPointerMove_(ev) {
        if (!ev.data.point) {
            this.cursor_.rawValue = -1;
            return;
        }
        this.cursor_.rawValue = Math.floor(mapRange(ev.data.point.x, 0, ev.data.bounds.width, 0, this.value.rawValue.length));
    }
    onGraphPointerUp_() {
        this.cursor_.rawValue = -1;
    }
}
