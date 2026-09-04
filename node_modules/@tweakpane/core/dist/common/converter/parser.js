export function composeParsers(parsers) {
    return (text) => {
        return parsers.reduce((result, parser) => {
            if (result !== null) {
                return result;
            }
            return parser(text);
        }, null);
    };
}
