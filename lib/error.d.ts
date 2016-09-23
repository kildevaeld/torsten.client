export declare class TorstenClientError extends Error {
    message: string;
    constructor(message: string);
}
export declare class TorstenJSONError extends TorstenClientError {
    json: Object;
    constructor(message: string, json: Object);
}
export declare function createError(msg: string): TorstenClientError;
