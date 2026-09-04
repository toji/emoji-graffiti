import { ValueMap } from '../../../common/model/value-map.js';
import { ViewProps } from '../../../common/model/view-props.js';
import { View } from '../../../common/view/view.js';
/**
 * @hidden
 */
export type TabItemPropsObject = {
    selected: boolean;
    title: string | undefined;
};
/**
 * @hidden
 */
export type TabItemProps = ValueMap<TabItemPropsObject>;
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
export declare class TabItemView implements View {
    readonly element: HTMLElement;
    readonly buttonElement: HTMLButtonElement;
    readonly titleElement: HTMLElement;
    constructor(doc: Document, config: Config);
}
export {};
