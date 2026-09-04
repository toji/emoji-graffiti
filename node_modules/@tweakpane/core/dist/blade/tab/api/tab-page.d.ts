import { Bindable } from '../../../common/binding/target.js';
import { BaseBladeParams } from '../../../common/params.js';
import { BindingApi } from '../../binding/api/binding.js';
import { ButtonApi } from '../../button/api/button.js';
import { BladeApi } from '../../common/api/blade.js';
import { ContainerApi } from '../../common/api/container.js';
import { ContainerBladeApi } from '../../common/api/container-blade.js';
import { BindingParams, ButtonParams, FolderParams, TabParams } from '../../common/api/params.js';
import { FolderApi } from '../../folder/api/folder.js';
import { TabPageController } from '../controller/tab-page.js';
import { TabApi } from './tab.js';
export declare class TabPageApi extends ContainerBladeApi<TabPageController> implements ContainerApi {
    get title(): string;
    set title(title: string);
    get selected(): boolean;
    set selected(selected: boolean);
    get children(): BladeApi[];
    addButton(params: ButtonParams): ButtonApi;
    addFolder(params: FolderParams): FolderApi;
    addTab(params: TabParams): TabApi;
    add(api: BladeApi, opt_index?: number): void;
    remove(api: BladeApi): void;
    addBinding<O extends Bindable, Key extends keyof O>(object: O, key: Key, opt_params?: BindingParams): BindingApi<unknown, O[Key]>;
    addBlade(params: BaseBladeParams): BladeApi;
}
