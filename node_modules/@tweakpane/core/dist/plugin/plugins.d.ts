import { BladePlugin } from '../blade/plugin.js';
import { InputBindingPlugin } from '../input-binding/plugin.js';
import { MonitorBindingPlugin } from '../monitor-binding/plugin.js';
import { PluginPool } from './pool.js';
export type TpPlugin = BladePlugin<any> | InputBindingPlugin<any, any, any> | MonitorBindingPlugin<any, any>;
export type TpPluginBundle = {
    /**
     * The custom CSS for the bundle.
     */
    css?: string;
    /**
     * The identifier of the bundle.
     */
    id: string;
    plugin: TpPlugin;
} | {
    /**
     * The custom CSS for the bundle.
     */
    css?: string;
    /**
     * The identifier of the bundle.
     */
    id: string;
    plugins: TpPlugin[];
};
export declare function createDefaultPluginPool(): PluginPool;
