export declare enum ErrorCode {
    AlreadyExists = 409,
    NotFound = 404,
    Unauthorized = 401,
    Unknown = 500,
    NullData = 600,
}
export declare class TorstenClientError extends Error {
    code: ErrorCode;
    message: string;
    constructor(code: ErrorCode, message: string);
    toJSON(): {
        message: string;
        code: ErrorCode;
    };
}
export declare class TorstenJSONError extends TorstenClientError {
    json: Object;
    constructor(code: ErrorCode, message: string, json: Object);
}
export declare function createError(code: ErrorCode, msg: string): TorstenClientError;
