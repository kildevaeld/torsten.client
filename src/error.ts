

export enum ErrorCode {
	AlreadyExists = 409,
	NotFound = 404,
    Unauthorized = 401,
    Unknown = 500,

    NullData = 600
}

export class TorstenClientError extends Error {
    constructor(public code: ErrorCode, public message: string) {
        super(message);
    }

    toJSON() {
        return {
            message: this.message,
            code: this.code
        };
    }
}

export class TorstenJSONError extends TorstenClientError {
    constructor(code: ErrorCode, message: string, public json:Object) {
        super(code, message);
    }
}

export function createError(code: ErrorCode, msg: string) {
    return new TorstenClientError(code, msg);
}