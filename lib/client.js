"use strict";
const orange_1 = require('orange');
const utils_1 = require('./utils');
const file_info_1 = require('./file-info');
const error_1 = require('./error');
const request = require('./request');
const orange_request_1 = require('orange.request');
function validateConfig(options) {
}
class TorstenClient {
    constructor(options) {
        validateConfig(options);
        this._options = options;
    }
    get endpoint() {
        return this._options.endpoint;
    }
    create(path, data, options = {}) {
        if (data == null)
            return Promise.reject(error_1.createError("no data"));
        let req = orange_1.extend({}, options);
        let promise;
        if (utils_1.isNode && utils_1.isReadableStream(data)) {
        }
        else {
            promise = request.upload(this._toUrl(path), req, data);
        }
        return promise.then(res => res.json())
            .then(json => {
            if (json.message != "ok") {
                throw error_1.createError("invalid response");
            }
            return json.data;
        });
    }
    stat(path, options = {}) {
        let url = this._toUrl(path);
        return request.request(orange_request_1.HttpMethod.GET, url, {
            progress: options.progress,
            params: { stat: true }
        }).then(res => {
            return res.json();
        }).then(i => new file_info_1.FileInfo(i.data));
    }
    statById(id, options = {}) {
        return request.request(orange_request_1.HttpMethod.GET, this.endpoint, {
            progress: options.progress,
            params: { stat: true, id: id }
        }).then(res => {
            return res.json();
        }).then(i => new file_info_1.FileInfo(i.data));
    }
    list(path, options = {}) {
        var req = request.request(orange_request_1.HttpMethod.GET, this._toUrl(path), options);
        return req.then(res => {
            return res.json();
        }).then(infos => {
            if (infos.message != 'ok')
                return [];
            return infos.data.map(i => new file_info_1.FileInfo(i));
        });
    }
    open(path, options = {}) {
        return this.stat(path, options)
            .then(info => {
            let r = { progress: options.progress };
            if (options.thumbnail) {
                r.params = r.params || {};
                r.params.thumbnail = true;
            }
            if (utils_1.isNode && options.stream) {
            }
            return request.request(orange_request_1.HttpMethod.GET, this._toUrl(path), r)
                .then(r => r.blob());
        });
    }
    remove(path) {
        let url = this._toUrl(path);
        return request.request(orange_request_1.HttpMethod.DELETE, url, {})
            .then(res => res.json());
    }
    _toUrl(path) {
        if (path.substr(0, 1) != "/") {
            path = "/" + path;
        }
        return this._options.endpoint + path;
    }
}
exports.TorstenClient = TorstenClient;
