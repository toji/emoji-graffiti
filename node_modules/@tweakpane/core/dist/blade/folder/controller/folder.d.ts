import { ViewProps } from '../../../common/model/view-props.js';
import { BladeState } from '../../common/controller/blade-state.js';
import { ContainerBladeController } from '../../common/controller/container-blade.js';
import { Blade } from '../../common/model/blade.js';
import { Foldable } from '../../common/model/foldable.js';
import { FolderProps, FolderView } from '../view/folder.js';
/**
 * @hidden
 */
interface Config {
    expanded?: boolean;
    blade: Blade;
    props: FolderProps;
    viewProps: ViewProps;
    root?: boolean;
}
/**
 * @hidden
 */
export declare class FolderController extends ContainerBladeController<FolderView> {
    readonly foldable: Foldable;
    readonly props: FolderProps;
    /**
     * @hidden
     */
    constructor(doc: Document, config: Config);
    get document(): Document;
    importState(state: BladeState): boolean;
    exportState(): BladeState;
    private onTitleClick_;
}
export {};
