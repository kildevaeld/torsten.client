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
    toJSON(): any;
}
export declare class TorstenJSONError extends TorstenClientError {
    json: Object;
    constructor(code: ErrorCode, message: string, json: Object);
    toJSON(): {
        code: ErrorCode;
        message: string;
        data: Object;
    };
}
export declare function createError(code: ErrorCode, msg: string): TorstenClientError;
