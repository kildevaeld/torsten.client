"use strict";
(function (ErrorCode) {
    ErrorCode[ErrorCode["AlreadyExists"] = 409] = "AlreadyExists";
    ErrorCode[ErrorCode["NotFound"] = 404] = "NotFound";
    ErrorCode[ErrorCode["Unauthorized"] = 401] = "Unauthorized";
    ErrorCode[ErrorCode["Unknown"] = 500] = "Unknown";
    ErrorCode[ErrorCode["NullData"] = 600] = "NullData";
})(exports.ErrorCode || (exports.ErrorCode = {}));
var ErrorCode = exports.ErrorCode;
class TorstenClientError extends Error {
    constructor(code, message) {
        super(message);
        this.code = code;
        this.message = message;
    }
    toJSON() {
        return {
            message: this.message,
            code: this.code
        };
    }
}
exports.TorstenClientError = TorstenClientError;
class TorstenJSONError extends TorstenClientError {
    constructor(code, message, json) {
        super(code, message);
        this.json = json;
    }
}
exports.TorstenJSONError = TorstenJSONError;
function createError(code, msg) {
    return new TorstenClientError(code, msg);
}
exports.createError = createError;
