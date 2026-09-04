type MicroParsingResult<T> = {
    succeeded: true;
    value: T | undefined;
} | {
    succeeded: false;
    value: undefined;
};
export type MicroParser<T> = (value: unknown) => MicroParsingResult<T>;
export declare const MicroParsers: {
    optional: {
        custom: <T>(parse: (value: unknown) => T | undefined) => MicroParser<T>;
        boolean: MicroParser<boolean>;
        number: MicroParser<number>;
        string: MicroParser<string>;
        function: MicroParser<Function>;
        constant: <T_1>(value: T_1) => MicroParser<T_1>;
        raw: MicroParser<unknown>;
        object: <O extends Record<string, unknown>>(keyToParserMap: { [Key in keyof O]: MicroParser<O[Key]>; }) => MicroParser<O>;
        array: <T_2>(itemParser: MicroParser<T_2>) => MicroParser<T_2[]>;
    };
    required: {
        custom: <T>(parse: (value: unknown) => T | undefined) => MicroParser<T>;
        boolean: MicroParser<boolean>;
        number: MicroParser<number>;
        string: MicroParser<string>;
        function: MicroParser<Function>;
        constant: <T_1>(value: T_1) => MicroParser<T_1>;
        raw: MicroParser<unknown>;
        object: <O extends Record<string, unknown>>(keyToParserMap: { [Key in keyof O]: MicroParser<O[Key]>; }) => MicroParser<O>;
        array: <T_2>(itemParser: MicroParser<T_2>) => MicroParser<T_2[]>;
    };
};
export declare function parseRecord<O extends Record<string, unknown>>(value: Record<string, unknown>, keyToParserMap: (p: typeof MicroParsers) => {
    [Key in keyof O]: MicroParser<O[Key]>;
}): O | undefined;
export {};
