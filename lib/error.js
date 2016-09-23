"use strict";
class TorstenClientError extends Error {
    constructor(message) {
        super(message);
        this.message = message;
    }
}
exports.TorstenClientError = TorstenClientError;
class TorstenJSONError extends TorstenClientError {
    constructor(message, json) {
        super(message);
        this.json = json;
    }
}
exports.TorstenJSONError = TorstenJSONError;
function createError(msg) {
    return new TorstenClientError(msg);
}
exports.createError = createError;
