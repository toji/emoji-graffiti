import { BindingApi } from '../blade/binding/api/binding.js';
import { isBindingController, } from '../blade/binding/controller/binding.js';
import { isInputBindingController, } from '../blade/binding/controller/input-binding.js';
import { isMonitorBindingController, } from '../blade/binding/controller/monitor-binding.js';
import { createBladeController } from '../blade/plugin.js';
import { isCompatible } from '../common/compat.js';
import { TpError } from '../common/tp-error.js';
import { createInputBindingController, } from '../input-binding/plugin.js';
import { isEmpty } from '../misc/type-util.js';
import { createMonitorBindingController, } from '../monitor-binding/plugin.js';
/**
 * @hidden
 */
export class PluginPool {
    constructor(apiCache) {
        this.pluginsMap_ = {
            blades: [],
            inputs: [],
            monitors: [],
        };
        this.apiCache_ = apiCache;
    }
    getAll() {
        return [
            ...this.pluginsMap_.blades,
            ...this.pluginsMap_.inputs,
            ...this.pluginsMap_.monitors,
        ];
    }
    register(bundleId, r) {
        if (!isCompatible(r.core)) {
            throw TpError.notCompatible(bundleId, r.id);
        }
        if (r.type === 'blade') {
            this.pluginsMap_.blades.unshift(r);
        }
        else if (r.type === 'input') {
            this.pluginsMap_.inputs.unshift(r);
        }
        else if (r.type === 'monitor') {
            this.pluginsMap_.monitors.unshift(r);
        }
    }
    createInput_(document, target, params) {
        return this.pluginsMap_.inputs.reduce((result, plugin) => result !== null && result !== void 0 ? result : createInputBindingController(plugin, {
            document: document,
            target: target,
            params: params,
        }), null);
    }
    createMonitor_(document, target, params) {
        return this.pluginsMap_.monitors.reduce((result, plugin) => result !== null && result !== void 0 ? result : createMonitorBindingController(plugin, {
            document: document,
            params: params,
            target: target,
        }), null);
    }
    createBinding(doc, target, params) {
        const initialValue = target.read();
        if (isEmpty(initialValue)) {
            throw new TpError({
                context: {
                    key: target.key,
                },
                type: 'nomatchingcontroller',
            });
        }
        const ic = this.createInput_(doc, target, params);
        if (ic) {
            return ic;
        }
        const mc = this.createMonitor_(doc, target, params);
        if (mc) {
            return mc;
        }
        throw new TpError({
            context: {
                key: target.key,
            },
            type: 'nomatchingcontroller',
        });
    }
    createBlade(document, params) {
        const bc = this.pluginsMap_.blades.reduce((result, plugin) => result !== null && result !== void 0 ? result : createBladeController(plugin, {
            document: document,
            params: params,
        }), null);
        if (!bc) {
            throw new TpError({
                type: 'nomatchingview',
                context: {
                    params: params,
                },
            });
        }
        return bc;
    }
    createInputBindingApi_(bc) {
        const api = this.pluginsMap_.inputs.reduce((result, plugin) => {
            var _a, _b;
            if (result) {
                return result;
            }
            return ((_b = (_a = plugin.api) === null || _a === void 0 ? void 0 : _a.call(plugin, {
                controller: bc,
            })) !== null && _b !== void 0 ? _b : null);
        }, null);
        return this.apiCache_.add(bc, api !== null && api !== void 0 ? api : new BindingApi(bc));
    }
    createMonitorBindingApi_(bc) {
        const api = this.pluginsMap_.monitors.reduce((result, plugin) => {
            var _a, _b;
            if (result) {
                return result;
            }
            return ((_b = (_a = plugin.api) === null || _a === void 0 ? void 0 : _a.call(plugin, {
                controller: bc,
            })) !== null && _b !== void 0 ? _b : null);
        }, null);
        return this.apiCache_.add(bc, api !== null && api !== void 0 ? api : new BindingApi(bc));
    }
    createBindingApi(bc) {
        if (this.apiCache_.has(bc)) {
            return this.apiCache_.get(bc);
        }
        if (isInputBindingController(bc)) {
            return this.createInputBindingApi_(bc);
        }
        /* istanbul ignore else */
        if (isMonitorBindingController(bc)) {
            return this.createMonitorBindingApi_(bc);
        }
        /* istanbul ignore next */
        throw TpError.shouldNeverHappen();
    }
    createApi(bc) {
        if (this.apiCache_.has(bc)) {
            return this.apiCache_.get(bc);
        }
        if (isBindingController(bc)) {
            return this.createBindingApi(bc);
        }
        const api = this.pluginsMap_.blades.reduce((result, plugin) => result !== null && result !== void 0 ? result : plugin.api({
            controller: bc,
            pool: this,
        }), null);
        /* istanbul ignore next */
        if (!api) {
            throw TpError.shouldNeverHappen();
        }
        return this.apiCache_.add(bc, api);
    }
}
