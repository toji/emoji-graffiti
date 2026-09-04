import { MonitorBindingApi } from '../blade/binding/api/monitor-binding.js';
import { BufferedValueController, MonitorBindingController } from '../blade/binding/controller/monitor-binding.js';
import { BindingReader } from '../common/binding/binding.js';
import { BindingTarget } from '../common/binding/target.js';
import { BufferedValue } from '../common/model/buffered-value.js';
import { ViewProps } from '../common/model/view-props.js';
import { BaseMonitorParams } from '../common/params.js';
import { BasePlugin } from '../plugin/plugin.js';
interface Acceptance<T, P extends BaseMonitorParams> {
    initialValue: T;
    params: P;
}
export interface BindingArguments<T, P extends BaseMonitorParams> {
    initialValue: T;
    params: P;
    target: BindingTarget;
}
interface ControllerArguments<T, P extends BaseMonitorParams> {
    document: Document;
    params: P;
    value: BufferedValue<T>;
    viewProps: ViewProps;
}
interface ApiArguments {
    controller: MonitorBindingController<unknown>;
}
/**
 * A monitor binding plugin interface.
 * @template T The type of the value.
 * @template P The type of the parameters.
 */
export interface MonitorBindingPlugin<T, P extends BaseMonitorParams> extends BasePlugin {
    type: 'monitor';
    accept: {
        /**
         * @param exValue The value input by users.
         * @param params The additional parameters specified by users.
         * @return A typed value if the plugin accepts the input, or null if the plugin sees them off and pass them to the next plugin.
         */
        (exValue: unknown, params: Record<string, unknown>): Acceptance<T, P> | null;
    };
    /**
     * Configurations of the binding.
     */
    binding: {
        /**
         * Creates a value reader from the user input.
         */
        reader: {
            /**
             * @param args The arguments for binding.
             * @return A value reader.
             */
            (args: BindingArguments<T, P>): BindingReader<T>;
        };
        /**
         * Determinates the default buffer size of the plugin.
         */
        defaultBufferSize?: {
            /**
             * @param params The additional parameters specified by users.
             * @return The default buffer size
             */
            (params: P): number;
        };
    };
    /**
     * Creates a custom controller for the plugin.
     */
    controller: {
        /**
         * @param args The arguments for creating a controller.
         * @return A custom controller that contains a custom view.
         */
        (args: ControllerArguments<T, P>): BufferedValueController<T>;
    };
    /**
     * Creates a custom API for the plugin if available.
     */
    api?: {
        /**
         * @param args The arguments for creating an API.
         * @return A custom API for the specified controller, or null if there is no suitable API.
         */
        (args: ApiArguments): MonitorBindingApi<T> | null;
    };
}
export declare function createMonitorBindingController<T, P extends BaseMonitorParams>(plugin: MonitorBindingPlugin<T, P>, args: {
    document: Document;
    params: Record<string, unknown>;
    target: BindingTarget;
}): MonitorBindingController<T> | null;
export {};
