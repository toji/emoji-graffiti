import { BinaryOperationNode, NumberLiteralNode, UnaryOperationNode, } from './nodes.js';
import { readNumericLiteral, readWhitespace } from './reader.js';
function parseLiteral(text, cursor) {
    const num = readNumericLiteral(text, cursor);
    cursor += num.length;
    if (num === '') {
        return null;
    }
    return {
        evaluable: new NumberLiteralNode(num),
        cursor: cursor,
    };
}
function parseParenthesizedExpression(text, cursor) {
    const op = text.substr(cursor, 1);
    cursor += op.length;
    if (op !== '(') {
        return null;
    }
    const expr = parseExpression(text, cursor);
    if (!expr) {
        return null;
    }
    cursor = expr.cursor;
    cursor += readWhitespace(text, cursor).length;
    const cl = text.substr(cursor, 1);
    cursor += cl.length;
    if (cl !== ')') {
        return null;
    }
    return {
        evaluable: expr.evaluable,
        cursor: cursor,
    };
}
function parsePrimaryExpression(text, cursor) {
    var _a;
    return ((_a = parseLiteral(text, cursor)) !== null && _a !== void 0 ? _a : parseParenthesizedExpression(text, cursor));
}
function parseUnaryExpression(text, cursor) {
    const expr = parsePrimaryExpression(text, cursor);
    if (expr) {
        return expr;
    }
    const op = text.substr(cursor, 1);
    cursor += op.length;
    if (op !== '+' && op !== '-' && op !== '~') {
        return null;
    }
    const num = parseUnaryExpression(text, cursor);
    if (!num) {
        return null;
    }
    cursor = num.cursor;
    return {
        cursor: cursor,
        evaluable: new UnaryOperationNode(op, num.evaluable),
    };
}
function readBinaryOperator(ops, text, cursor) {
    cursor += readWhitespace(text, cursor).length;
    const op = ops.filter((op) => text.startsWith(op, cursor))[0];
    if (!op) {
        return null;
    }
    cursor += op.length;
    cursor += readWhitespace(text, cursor).length;
    return {
        cursor: cursor,
        operator: op,
    };
}
function createBinaryOperationExpressionParser(exprParser, ops) {
    return (text, cursor) => {
        const firstExpr = exprParser(text, cursor);
        if (!firstExpr) {
            return null;
        }
        cursor = firstExpr.cursor;
        let expr = firstExpr.evaluable;
        for (;;) {
            const op = readBinaryOperator(ops, text, cursor);
            if (!op) {
                break;
            }
            cursor = op.cursor;
            const nextExpr = exprParser(text, cursor);
            if (!nextExpr) {
                return null;
            }
            cursor = nextExpr.cursor;
            expr = new BinaryOperationNode(op.operator, expr, nextExpr.evaluable);
        }
        return expr
            ? {
                cursor: cursor,
                evaluable: expr,
            }
            : null;
    };
}
const parseBinaryOperationExpression = [
    ['**'],
    ['*', '/', '%'],
    ['+', '-'],
    ['<<', '>>>', '>>'],
    ['&'],
    ['^'],
    ['|'],
].reduce((parser, ops) => {
    return createBinaryOperationExpressionParser(parser, ops);
}, parseUnaryExpression);
function parseExpression(text, cursor) {
    cursor += readWhitespace(text, cursor).length;
    return parseBinaryOperationExpression(text, cursor);
}
/**
 * Parse ECMAScript expression with numeric literals.
 * https://262.ecma-international.org/
 * @param text The string to be parsed.
 * @return A parsing result, or null if failed.
 */
export function parseEcmaNumberExpression(text) {
    const expr = parseExpression(text, 0);
    if (!expr) {
        return null;
    }
    const cursor = expr.cursor + readWhitespace(text, expr.cursor).length;
    if (cursor !== text.length) {
        return null;
    }
    return expr.evaluable;
}
