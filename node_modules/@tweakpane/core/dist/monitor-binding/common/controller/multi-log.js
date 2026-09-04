import { MultiLogView } from '../view/multi-log.js';
/**
 * @hidden
 */
export class MultiLogController {
    constructor(doc, config) {
        this.value = config.value;
        this.viewProps = config.viewProps;
        this.view = new MultiLogView(doc, {
            formatter: config.formatter,
            rows: config.rows,
            value: this.value,
            viewProps: this.viewProps,
        });
    }
}
