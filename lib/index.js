"use strict";

function __export(m) {
    for (var p in m) {
        if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
}
__export(require("./client"));
__export(require("./types"));
__export(require("./error"));
var utils_1 = require("./utils");
exports.readBlobAsText = utils_1.readBlobAsText;
exports.readBlobAsArrayBuffer = utils_1.readBlobAsArrayBuffer;
exports.readBlobAsDataURL = utils_1.readBlobAsDataURL;
exports.path = utils_1.path;
__export(require("./file-info"));