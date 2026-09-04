import { Controller } from '../../../common/controller/controller.js';
import { Emitter } from '../../../common/model/emitter.js';
import { ViewProps } from '../../../common/model/view-props.js';
import { TabItemProps, TabItemView } from '../view/tab-item.js';
/**
 * @hidden
 */
export interface TabItemEvents {
    click: {
        sender: TabItemController;
    };
}
/**
 * @hidden
 */
interface Config {
    props: TabItemProps;
    viewProps: ViewProps;
}
/**
 * @hidden
 */
export declare class TabItemController implements Controller<TabItemView> {
    readonly emitter: Emitter<TabItemEvents>;
    readonly props: TabItemProps;
    readonly view: TabItemView;
    readonly viewProps: ViewProps;
    constructor(doc: Document, config: Config);
    private onClick_;
}
export {};
