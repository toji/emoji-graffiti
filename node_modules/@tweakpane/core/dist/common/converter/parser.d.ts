export type Parser<T> = (text: string) => T | null;
export declare function composeParsers<T>(parsers: Parser<T>[]): Parser<T>;
