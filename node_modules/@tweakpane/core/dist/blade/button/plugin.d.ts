import { BaseBladeParams } from '../../common/params.js';
import { BladePlugin } from '../plugin.js';
export interface ButtonBladeParams extends BaseBladeParams {
    title: string;
    view: 'button';
    label?: string;
}
export declare const ButtonBladePlugin: BladePlugin<ButtonBladeParams>;
