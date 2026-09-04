import { VERSION } from '../version.js';
/**
 * Creates a plugin with the current core.
 * @param plugin The plugin without the core version.
 * @return A plugin with the core version.
 */
export function createPlugin(plugin) {
    return Object.assign({ core: VERSION }, plugin);
}
