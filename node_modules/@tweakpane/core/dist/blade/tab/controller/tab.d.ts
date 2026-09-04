import { ViewProps } from '../../../common/model/view-props.js';
import { ContainerBladeController } from '../../common/controller/container-blade.js';
import { Blade } from '../../common/model/blade.js';
import { Tab } from '../model/tab.js';
import { TabView } from '../view/tab.js';
import { TabPageController } from './tab-page.js';
/**
 * @hidden
 */
interface Config {
    blade: Blade;
    viewProps: ViewProps;
}
/**
 * @hidden
 */
export declare class TabController extends ContainerBladeController<TabView> {
    readonly tab: Tab;
    constructor(doc: Document, config: Config);
    add(pc: TabPageController, opt_index?: number): void;
    remove(index: number): void;
    private onRackAdd_;
    private onRackRemove_;
}
export {};
