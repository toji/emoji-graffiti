import { forceCast } from '../misc/type-util.js';
function parseObject(value, keyToParserMap) {
    const keys = Object.keys(keyToParserMap);
    const result = keys.reduce((tmp, key) => {
        if (tmp === undefined) {
            return undefined;
        }
        const parser = keyToParserMap[key];
        const result = parser(value[key]);
        return result.succeeded
            ? Object.assign(Object.assign({}, tmp), { [key]: result.value }) : undefined;
    }, {});
    return forceCast(result);
}
function parseArray(value, parseItem) {
    return value.reduce((tmp, item) => {
        if (tmp === undefined) {
            return undefined;
        }
        const result = parseItem(item);
        if (!result.succeeded || result.value === undefined) {
            return undefined;
        }
        return [...tmp, result.value];
    }, []);
}
function isObject(value) {
    if (value === null) {
        return false;
    }
    return typeof value === 'object';
}
function createMicroParserBuilder(parse) {
    return (optional) => (v) => {
        if (!optional && v === undefined) {
            return {
                succeeded: false,
                value: undefined,
            };
        }
        if (optional && v === undefined) {
            return {
                succeeded: true,
                value: undefined,
            };
        }
        const result = parse(v);
        return result !== undefined
            ? {
                succeeded: true,
                value: result,
            }
            : {
                succeeded: false,
                value: undefined,
            };
    };
}
function createMicroParserBuilders(optional) {
    return {
        custom: (parse) => createMicroParserBuilder(parse)(optional),
        boolean: createMicroParserBuilder((v) => typeof v === 'boolean' ? v : undefined)(optional),
        number: createMicroParserBuilder((v) => typeof v === 'number' ? v : undefined)(optional),
        string: createMicroParserBuilder((v) => typeof v === 'string' ? v : undefined)(optional),
        // eslint-disable-next-line @typescript-eslint/ban-types
        function: createMicroParserBuilder((v) => 
        // eslint-disable-next-line @typescript-eslint/ban-types
        typeof v === 'function' ? v : undefined)(optional),
        constant: (value) => createMicroParserBuilder((v) => (v === value ? value : undefined))(optional),
        raw: createMicroParserBuilder((v) => v)(optional),
        object: (keyToParserMap) => createMicroParserBuilder((v) => {
            if (!isObject(v)) {
                return undefined;
            }
            return parseObject(v, keyToParserMap);
        })(optional),
        array: (itemParser) => createMicroParserBuilder((v) => {
            if (!Array.isArray(v)) {
                return undefined;
            }
            return parseArray(v, itemParser);
        })(optional),
    };
}
export const MicroParsers = {
    optional: createMicroParserBuilders(true),
    required: createMicroParserBuilders(false),
};
export function parseRecord(value, keyToParserMap) {
    const map = keyToParserMap(MicroParsers);
    const result = MicroParsers.required.object(map)(value);
    return result.succeeded ? result.value : undefined;
}
