import { BaseBladeParams } from '../../common/params.js';
import { BladePlugin } from '../plugin.js';
export interface TabBladeParams extends BaseBladeParams {
    pages: {
        title: string;
    }[];
    view: 'tab';
}
export declare const TabBladePlugin: BladePlugin<TabBladeParams>;
