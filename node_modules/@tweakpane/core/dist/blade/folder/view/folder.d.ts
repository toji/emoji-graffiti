import { ValueMap } from '../../../common/model/value-map.js';
import { ViewProps } from '../../../common/model/view-props.js';
import { View } from '../../../common/view/view.js';
import { Foldable } from '../../common/model/foldable.js';
/**
 * @hidden
 */
export type FolderPropsObject = {
    title: string | undefined;
};
/**
 * @hidden
 */
export type FolderProps = ValueMap<FolderPropsObject>;
/**
 * @hidden
 */
interface Config {
    foldable: Foldable;
    props: FolderProps;
    viewProps: ViewProps;
    viewName?: string;
}
/**
 * @hidden
 */
export declare class FolderView implements View {
    readonly buttonElement: HTMLButtonElement;
    readonly containerElement: HTMLElement;
    readonly titleElement: HTMLElement;
    readonly element: HTMLElement;
    private readonly foldable_;
    private readonly className_;
    constructor(doc: Document, config: Config);
}
export {};
