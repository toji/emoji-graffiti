import { createValue } from '../model/values.js';
import { PopupView } from '../view/popup.js';
export class PopupController {
    constructor(doc, config) {
        this.shows = createValue(false);
        this.viewProps = config.viewProps;
        this.view = new PopupView(doc, {
            shows: this.shows,
            viewProps: this.viewProps,
        });
    }
}
