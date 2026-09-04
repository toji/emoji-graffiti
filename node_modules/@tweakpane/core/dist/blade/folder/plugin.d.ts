import { BaseBladeParams } from '../../common/params.js';
import { BladePlugin } from '../plugin.js';
export interface FolderBladeParams extends BaseBladeParams {
    title: string;
    view: 'folder';
    expanded?: boolean;
}
export declare const FolderBladePlugin: BladePlugin<FolderBladeParams>;
