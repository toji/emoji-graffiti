import { ValueMap } from '../../../common/model/value-map.js';
import { ViewProps } from '../../../common/model/view-props.js';
import { PlainView } from '../../../common/view/plain.js';
import { BladeState } from '../../common/controller/blade-state.js';
import { ContainerBladeController } from '../../common/controller/container-blade.js';
import { Blade } from '../../common/model/blade.js';
import { TabItemProps } from '../view/tab-item.js';
import { TabItemController } from './tab-item.js';
/**
 * @hidden
 */
export type TabPagePropsObject = {
    selected: boolean;
};
/**
 * @hidden
 */
export type TabPageProps = ValueMap<TabPagePropsObject>;
/**
 * @hidden
 */
interface Config {
    blade: Blade;
    itemProps: TabItemProps;
    props: TabPageProps;
    viewProps: ViewProps;
}
/**
 * @hidden
 */
export declare class TabPageController extends ContainerBladeController<PlainView> {
    readonly props: TabPageProps;
    private readonly ic_;
    constructor(doc: Document, config: Config);
    get itemController(): TabItemController;
    importState(state: BladeState): boolean;
    exportState(): BladeState;
    private onItemClick_;
}
export {};
