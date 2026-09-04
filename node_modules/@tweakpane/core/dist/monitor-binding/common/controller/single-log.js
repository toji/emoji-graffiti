import { SingleLogView } from '../view/single-log.js';
/**
 * @hidden
 */
export class SingleLogController {
    constructor(doc, config) {
        this.value = config.value;
        this.viewProps = config.viewProps;
        this.view = new SingleLogView(doc, {
            formatter: config.formatter,
            value: this.value,
            viewProps: this.viewProps,
        });
    }
}
