import { createNumberFormatter } from '../../../common/converter/number.js';
import { composeParsers } from '../../../common/converter/parser.js';
import { formatPercentage } from '../../../common/converter/percentage.js';
import { constrainRange, mapRange } from '../../../common/number/util.js';
import { removeAlphaComponent, } from '../model/color-model.js';
import { createColor, mapColorType } from '../model/colors.js';
import { IntColor } from '../model/int-color.js';
function equalsStringColorFormat(f1, f2) {
    return (f1.alpha === f2.alpha &&
        f1.mode === f2.mode &&
        f1.notation === f2.notation &&
        f1.type === f2.type);
}
function parseCssNumberOrPercentage(text, max) {
    const m = text.match(/^(.+)%$/);
    if (!m) {
        return Math.min(parseFloat(text), max);
    }
    return Math.min(parseFloat(m[1]) * 0.01 * max, max);
}
const ANGLE_TO_DEG_MAP = {
    deg: (angle) => angle,
    grad: (angle) => (angle * 360) / 400,
    rad: (angle) => (angle * 360) / (2 * Math.PI),
    turn: (angle) => angle * 360,
};
function parseCssNumberOrAngle(text) {
    const m = text.match(/^([0-9.]+?)(deg|grad|rad|turn)$/);
    if (!m) {
        return parseFloat(text);
    }
    const angle = parseFloat(m[1]);
    const unit = m[2];
    return ANGLE_TO_DEG_MAP[unit](angle);
}
function parseFunctionalRgbColorComponents(text) {
    const m = text.match(/^rgb\(\s*([0-9A-Fa-f.]+%?)\s*,\s*([0-9A-Fa-f.]+%?)\s*,\s*([0-9A-Fa-f.]+%?)\s*\)$/);
    if (!m) {
        return null;
    }
    const comps = [
        parseCssNumberOrPercentage(m[1], 255),
        parseCssNumberOrPercentage(m[2], 255),
        parseCssNumberOrPercentage(m[3], 255),
    ];
    if (isNaN(comps[0]) || isNaN(comps[1]) || isNaN(comps[2])) {
        return null;
    }
    return comps;
}
function parseFunctionalRgbColor(text) {
    const comps = parseFunctionalRgbColorComponents(text);
    return comps ? new IntColor(comps, 'rgb') : null;
}
function parseFunctionalRgbaColorComponents(text) {
    const m = text.match(/^rgba\(\s*([0-9A-Fa-f.]+%?)\s*,\s*([0-9A-Fa-f.]+%?)\s*,\s*([0-9A-Fa-f.]+%?)\s*,\s*([0-9A-Fa-f.]+%?)\s*\)$/);
    if (!m) {
        return null;
    }
    const comps = [
        parseCssNumberOrPercentage(m[1], 255),
        parseCssNumberOrPercentage(m[2], 255),
        parseCssNumberOrPercentage(m[3], 255),
        parseCssNumberOrPercentage(m[4], 1),
    ];
    if (isNaN(comps[0]) ||
        isNaN(comps[1]) ||
        isNaN(comps[2]) ||
        isNaN(comps[3])) {
        return null;
    }
    return comps;
}
function parseFunctionalRgbaColor(text) {
    const comps = parseFunctionalRgbaColorComponents(text);
    return comps ? new IntColor(comps, 'rgb') : null;
}
function parseFunctionalHslColorComponents(text) {
    const m = text.match(/^hsl\(\s*([0-9A-Fa-f.]+(?:deg|grad|rad|turn)?)\s*,\s*([0-9A-Fa-f.]+%?)\s*,\s*([0-9A-Fa-f.]+%?)\s*\)$/);
    if (!m) {
        return null;
    }
    const comps = [
        parseCssNumberOrAngle(m[1]),
        parseCssNumberOrPercentage(m[2], 100),
        parseCssNumberOrPercentage(m[3], 100),
    ];
    if (isNaN(comps[0]) || isNaN(comps[1]) || isNaN(comps[2])) {
        return null;
    }
    return comps;
}
function parseFunctionalHslColor(text) {
    const comps = parseFunctionalHslColorComponents(text);
    return comps ? new IntColor(comps, 'hsl') : null;
}
function parseHslaColorComponents(text) {
    const m = text.match(/^hsla\(\s*([0-9A-Fa-f.]+(?:deg|grad|rad|turn)?)\s*,\s*([0-9A-Fa-f.]+%?)\s*,\s*([0-9A-Fa-f.]+%?)\s*,\s*([0-9A-Fa-f.]+%?)\s*\)$/);
    if (!m) {
        return null;
    }
    const comps = [
        parseCssNumberOrAngle(m[1]),
        parseCssNumberOrPercentage(m[2], 100),
        parseCssNumberOrPercentage(m[3], 100),
        parseCssNumberOrPercentage(m[4], 1),
    ];
    if (isNaN(comps[0]) ||
        isNaN(comps[1]) ||
        isNaN(comps[2]) ||
        isNaN(comps[3])) {
        return null;
    }
    return comps;
}
function parseFunctionalHslaColor(text) {
    const comps = parseHslaColorComponents(text);
    return comps ? new IntColor(comps, 'hsl') : null;
}
function parseHexRgbColorComponents(text) {
    const mRgb = text.match(/^#([0-9A-Fa-f])([0-9A-Fa-f])([0-9A-Fa-f])$/);
    if (mRgb) {
        return [
            parseInt(mRgb[1] + mRgb[1], 16),
            parseInt(mRgb[2] + mRgb[2], 16),
            parseInt(mRgb[3] + mRgb[3], 16),
        ];
    }
    const mRrggbb = text.match(/^(?:#|0x)([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})$/);
    if (mRrggbb) {
        return [
            parseInt(mRrggbb[1], 16),
            parseInt(mRrggbb[2], 16),
            parseInt(mRrggbb[3], 16),
        ];
    }
    return null;
}
function parseHexRgbColor(text) {
    const comps = parseHexRgbColorComponents(text);
    return comps ? new IntColor(comps, 'rgb') : null;
}
function parseHexRgbaColorComponents(text) {
    const mRgb = text.match(/^#([0-9A-Fa-f])([0-9A-Fa-f])([0-9A-Fa-f])([0-9A-Fa-f])$/);
    if (mRgb) {
        return [
            parseInt(mRgb[1] + mRgb[1], 16),
            parseInt(mRgb[2] + mRgb[2], 16),
            parseInt(mRgb[3] + mRgb[3], 16),
            mapRange(parseInt(mRgb[4] + mRgb[4], 16), 0, 255, 0, 1),
        ];
    }
    const mRrggbb = text.match(/^(?:#|0x)?([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})$/);
    if (mRrggbb) {
        return [
            parseInt(mRrggbb[1], 16),
            parseInt(mRrggbb[2], 16),
            parseInt(mRrggbb[3], 16),
            mapRange(parseInt(mRrggbb[4], 16), 0, 255, 0, 1),
        ];
    }
    return null;
}
function parseHexRgbaColor(text) {
    const comps = parseHexRgbaColorComponents(text);
    return comps ? new IntColor(comps, 'rgb') : null;
}
function parseObjectRgbColorComponents(text) {
    const m = text.match(/^\{\s*r\s*:\s*([0-9A-Fa-f.]+%?)\s*,\s*g\s*:\s*([0-9A-Fa-f.]+%?)\s*,\s*b\s*:\s*([0-9A-Fa-f.]+%?)\s*\}$/);
    if (!m) {
        return null;
    }
    const comps = [
        parseFloat(m[1]),
        parseFloat(m[2]),
        parseFloat(m[3]),
    ];
    if (isNaN(comps[0]) || isNaN(comps[1]) || isNaN(comps[2])) {
        return null;
    }
    return comps;
}
function createObjectRgbColorParser(type) {
    return (text) => {
        const comps = parseObjectRgbColorComponents(text);
        return comps ? createColor(comps, 'rgb', type) : null;
    };
}
function parseObjectRgbaColorComponents(text) {
    const m = text.match(/^\{\s*r\s*:\s*([0-9A-Fa-f.]+%?)\s*,\s*g\s*:\s*([0-9A-Fa-f.]+%?)\s*,\s*b\s*:\s*([0-9A-Fa-f.]+%?)\s*,\s*a\s*:\s*([0-9A-Fa-f.]+%?)\s*\}$/);
    if (!m) {
        return null;
    }
    const comps = [
        parseFloat(m[1]),
        parseFloat(m[2]),
        parseFloat(m[3]),
        parseFloat(m[4]),
    ];
    if (isNaN(comps[0]) ||
        isNaN(comps[1]) ||
        isNaN(comps[2]) ||
        isNaN(comps[3])) {
        return null;
    }
    return comps;
}
function createObjectRgbaColorParser(type) {
    return (text) => {
        const comps = parseObjectRgbaColorComponents(text);
        return comps ? createColor(comps, 'rgb', type) : null;
    };
}
const PARSER_AND_RESULT = [
    {
        parser: parseHexRgbColorComponents,
        result: {
            alpha: false,
            mode: 'rgb',
            notation: 'hex',
        },
    },
    {
        parser: parseHexRgbaColorComponents,
        result: {
            alpha: true,
            mode: 'rgb',
            notation: 'hex',
        },
    },
    {
        parser: parseFunctionalRgbColorComponents,
        result: {
            alpha: false,
            mode: 'rgb',
            notation: 'func',
        },
    },
    {
        parser: parseFunctionalRgbaColorComponents,
        result: {
            alpha: true,
            mode: 'rgb',
            notation: 'func',
        },
    },
    {
        parser: parseFunctionalHslColorComponents,
        result: {
            alpha: false,
            mode: 'hsl',
            notation: 'func',
        },
    },
    {
        parser: parseHslaColorComponents,
        result: {
            alpha: true,
            mode: 'hsl',
            notation: 'func',
        },
    },
    {
        parser: parseObjectRgbColorComponents,
        result: {
            alpha: false,
            mode: 'rgb',
            notation: 'object',
        },
    },
    {
        parser: parseObjectRgbaColorComponents,
        result: {
            alpha: true,
            mode: 'rgb',
            notation: 'object',
        },
    },
];
function detectStringColor(text) {
    return PARSER_AND_RESULT.reduce((prev, { parser, result: detection }) => {
        if (prev) {
            return prev;
        }
        return parser(text) ? detection : null;
    }, null);
}
export function detectStringColorFormat(text, type = 'int') {
    const r = detectStringColor(text);
    if (!r) {
        return null;
    }
    if (r.notation === 'hex' && type !== 'float') {
        return Object.assign(Object.assign({}, r), { type: 'int' });
    }
    if (r.notation === 'func') {
        return Object.assign(Object.assign({}, r), { type: type });
    }
    return null;
}
export function createColorStringParser(type) {
    const parsers = [
        parseHexRgbColor,
        parseHexRgbaColor,
        parseFunctionalRgbColor,
        parseFunctionalRgbaColor,
        parseFunctionalHslColor,
        parseFunctionalHslaColor,
    ];
    if (type === 'int') {
        parsers.push(createObjectRgbColorParser('int'), createObjectRgbaColorParser('int'));
    }
    if (type === 'float') {
        parsers.push(createObjectRgbColorParser('float'), createObjectRgbaColorParser('float'));
    }
    const parser = composeParsers(parsers);
    return (text) => {
        const result = parser(text);
        return result ? mapColorType(result, type) : null;
    };
}
export function readIntColorString(value) {
    const parser = createColorStringParser('int');
    if (typeof value !== 'string') {
        return IntColor.black();
    }
    const result = parser(value);
    return result !== null && result !== void 0 ? result : IntColor.black();
}
function zerofill(comp) {
    const hex = constrainRange(Math.floor(comp), 0, 255).toString(16);
    return hex.length === 1 ? `0${hex}` : hex;
}
export function colorToHexRgbString(value, prefix = '#') {
    const hexes = removeAlphaComponent(value.getComponents('rgb'))
        .map(zerofill)
        .join('');
    return `${prefix}${hexes}`;
}
export function colorToHexRgbaString(value, prefix = '#') {
    const rgbaComps = value.getComponents('rgb');
    const hexes = [rgbaComps[0], rgbaComps[1], rgbaComps[2], rgbaComps[3] * 255]
        .map(zerofill)
        .join('');
    return `${prefix}${hexes}`;
}
export function colorToFunctionalRgbString(value) {
    const formatter = createNumberFormatter(0);
    const ci = mapColorType(value, 'int');
    const comps = removeAlphaComponent(ci.getComponents('rgb')).map((comp) => formatter(comp));
    return `rgb(${comps.join(', ')})`;
}
export function colorToFunctionalRgbaString(value) {
    const aFormatter = createNumberFormatter(2);
    const rgbFormatter = createNumberFormatter(0);
    const ci = mapColorType(value, 'int');
    const comps = ci.getComponents('rgb').map((comp, index) => {
        const formatter = index === 3 ? aFormatter : rgbFormatter;
        return formatter(comp);
    });
    return `rgba(${comps.join(', ')})`;
}
export function colorToFunctionalHslString(value) {
    const formatters = [
        createNumberFormatter(0),
        formatPercentage,
        formatPercentage,
    ];
    const ci = mapColorType(value, 'int');
    const comps = removeAlphaComponent(ci.getComponents('hsl')).map((comp, index) => formatters[index](comp));
    return `hsl(${comps.join(', ')})`;
}
export function colorToFunctionalHslaString(value) {
    const formatters = [
        createNumberFormatter(0),
        formatPercentage,
        formatPercentage,
        createNumberFormatter(2),
    ];
    const ci = mapColorType(value, 'int');
    const comps = ci
        .getComponents('hsl')
        .map((comp, index) => formatters[index](comp));
    return `hsla(${comps.join(', ')})`;
}
export function colorToObjectRgbString(value, type) {
    const formatter = createNumberFormatter(type === 'float' ? 2 : 0);
    const names = ['r', 'g', 'b'];
    const cc = mapColorType(value, type);
    const comps = removeAlphaComponent(cc.getComponents('rgb')).map((comp, index) => `${names[index]}: ${formatter(comp)}`);
    return `{${comps.join(', ')}}`;
}
function createObjectRgbColorFormatter(type) {
    return (value) => colorToObjectRgbString(value, type);
}
export function colorToObjectRgbaString(value, type) {
    const aFormatter = createNumberFormatter(2);
    const rgbFormatter = createNumberFormatter(type === 'float' ? 2 : 0);
    const names = ['r', 'g', 'b', 'a'];
    const cc = mapColorType(value, type);
    const comps = cc.getComponents('rgb').map((comp, index) => {
        const formatter = index === 3 ? aFormatter : rgbFormatter;
        return `${names[index]}: ${formatter(comp)}`;
    });
    return `{${comps.join(', ')}}`;
}
function createObjectRgbaColorFormatter(type) {
    return (value) => colorToObjectRgbaString(value, type);
}
const FORMAT_AND_STRINGIFIERS = [
    {
        format: {
            alpha: false,
            mode: 'rgb',
            notation: 'hex',
            type: 'int',
        },
        stringifier: colorToHexRgbString,
    },
    {
        format: {
            alpha: true,
            mode: 'rgb',
            notation: 'hex',
            type: 'int',
        },
        stringifier: colorToHexRgbaString,
    },
    {
        format: {
            alpha: false,
            mode: 'rgb',
            notation: 'func',
            type: 'int',
        },
        stringifier: colorToFunctionalRgbString,
    },
    {
        format: {
            alpha: true,
            mode: 'rgb',
            notation: 'func',
            type: 'int',
        },
        stringifier: colorToFunctionalRgbaString,
    },
    {
        format: {
            alpha: false,
            mode: 'hsl',
            notation: 'func',
            type: 'int',
        },
        stringifier: colorToFunctionalHslString,
    },
    {
        format: {
            alpha: true,
            mode: 'hsl',
            notation: 'func',
            type: 'int',
        },
        stringifier: colorToFunctionalHslaString,
    },
    ...['int', 'float'].reduce((prev, type) => {
        return [
            ...prev,
            {
                format: {
                    alpha: false,
                    mode: 'rgb',
                    notation: 'object',
                    type: type,
                },
                stringifier: createObjectRgbColorFormatter(type),
            },
            {
                format: {
                    alpha: true,
                    mode: 'rgb',
                    notation: 'object',
                    type: type,
                },
                stringifier: createObjectRgbaColorFormatter(type),
            },
        ];
    }, []),
];
export function findColorStringifier(format) {
    return FORMAT_AND_STRINGIFIERS.reduce((prev, fas) => {
        if (prev) {
            return prev;
        }
        return equalsStringColorFormat(fas.format, format)
            ? fas.stringifier
            : null;
    }, null);
}
