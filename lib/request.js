"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var orange_request_1 = require("orange.request");
var utils_1 = require("./utils");
function request(method, url, r) {
    var req = new orange_request_1.HttpRequest(method, url);
    if (r.params) req.params(r.params);
    if (r.headers) req.header(r.headers);
    if (utils_1.isNode) {
        req.header("User-Agent", "torsten-client/0.0.1");
    }
    req.header("Authorization", "Bearer " + r.token);
    if (method === orange_request_1.HttpMethod.POST || method === orange_request_1.HttpMethod.PUT) {
        req.uploadProgress(r.progress);
        return _upload(req, r);
    }
    return req.downloadProgress(r.progress).end(r.data).then(function (res) {
        return res;
    });
}
exports.request = request;
function _upload(req, options) {
    var mimeType = void 0,
        length = void 0,
        data = options.data;
    if (utils_1.isString(data)) {
        length = data.length;
        mimeType = options.mime || "text/plain";
    } else if (utils_1.isBuffer(data)) {
        length = data.length;
        mimeType = options.mime || "text/plain";
    } else if (utils_1.isObject(data) && !utils_1.isFile(data) && !utils_1.isFormData(data) && !utils_1.isReadableStream(data)) {
        try {
            data = JSON.stringify(data);
            length = data.length;
            mimeType = "application/json";
        } catch (e) {
            return Promise.reject(e);
        }
    }
    if (length) {
        req.header('Content-Length', "" + length);
    }
    if (utils_1.isFile(data)) {
        var form = new FormData();
        form.append('file', data);
        data = form;
    }
    if (mimeType && !utils_1.isFormData(data)) {
        req.header('Content-Type', mimeType);
    }
    return req.end(data);
}