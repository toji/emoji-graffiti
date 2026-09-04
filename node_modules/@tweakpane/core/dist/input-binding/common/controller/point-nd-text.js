import { connectValues } from '../../../common/model/value-sync.js';
import { createValue } from '../../../common/model/values.js';
import { NumberTextController } from '../../../common/number/controller/number-text.js';
import { PointNdTextView } from '../view/point-nd-text.js';
function createAxisController(doc, config, index) {
    return new NumberTextController(doc, {
        arrayPosition: index === 0 ? 'fst' : index === config.axes.length - 1 ? 'lst' : 'mid',
        parser: config.parser,
        props: config.axes[index].textProps,
        value: createValue(0, {
            constraint: config.axes[index].constraint,
        }),
        viewProps: config.viewProps,
    });
}
/**
 * @hidden
 */
export class PointNdTextController {
    constructor(doc, config) {
        this.value = config.value;
        this.viewProps = config.viewProps;
        this.acs_ = config.axes.map((_, index) => createAxisController(doc, config, index));
        this.acs_.forEach((c, index) => {
            connectValues({
                primary: this.value,
                secondary: c.value,
                forward: (p) => config.assembly.toComponents(p)[index],
                backward: (p, s) => {
                    const comps = config.assembly.toComponents(p);
                    comps[index] = s;
                    return config.assembly.fromComponents(comps);
                },
            });
        });
        this.view = new PointNdTextView(doc, {
            textViews: this.acs_.map((ac) => ac.view),
        });
    }
    get textControllers() {
        return this.acs_;
    }
}
