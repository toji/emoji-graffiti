import { forceCast } from '../misc/type-util.js';
const CREATE_MESSAGE_MAP = {
    alreadydisposed: () => 'View has been already disposed',
    invalidparams: (context) => `Invalid parameters for '${context.name}'`,
    nomatchingcontroller: (context) => `No matching controller for '${context.key}'`,
    nomatchingview: (context) => `No matching view for '${JSON.stringify(context.params)}'`,
    notbindable: () => `Value is not bindable`,
    notcompatible: (context) => `Not compatible with  plugin '${context.id}'`,
    propertynotfound: (context) => `Property '${context.name}' not found`,
    shouldneverhappen: () => 'This error should never happen',
};
export class TpError {
    static alreadyDisposed() {
        return new TpError({ type: 'alreadydisposed' });
    }
    static notBindable() {
        return new TpError({
            type: 'notbindable',
        });
    }
    static notCompatible(bundleId, id) {
        return new TpError({
            type: 'notcompatible',
            context: {
                id: `${bundleId}.${id}`,
            },
        });
    }
    static propertyNotFound(name) {
        return new TpError({
            type: 'propertynotfound',
            context: {
                name: name,
            },
        });
    }
    static shouldNeverHappen() {
        return new TpError({ type: 'shouldneverhappen' });
    }
    constructor(config) {
        var _a;
        this.message =
            (_a = CREATE_MESSAGE_MAP[config.type](forceCast(config.context))) !== null && _a !== void 0 ? _a : 'Unexpected error';
        this.name = this.constructor.name;
        this.stack = new Error(this.message).stack;
        this.type = config.type;
    }
    toString() {
        return this.message;
    }
}
