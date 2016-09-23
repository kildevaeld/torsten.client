
export class TorstenClientError extends Error {
    constructor(public message: string) {
        super(message);
    }
}

export class TorstenJSONError extends TorstenClientError {
    constructor(message: string, public json:Object) {
        super(message);
    }
}

export function createError(msg: string) {
    return new TorstenClientError(msg);
}