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
    set token(token) {
        this._token = token;
    }
    get token() {
        return this._token;
    }
    get endpoint() {
        return this._options.endpoint;
    }
    create(path, data, options = {}) {
        if (data == null)
            return Promise.reject(error_1.createError("no data"));
        let req = orange_1.extend({}, options, {
            token: this.token
        });
        return request.upload(this._toUrl(path), req, data)
            .then(res => res.json())
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
            params: { stat: true },
            token: this._token
        }).then(getResponse).then(res => {
            return res.json();
        }).then(i => new file_info_1.FileInfo(i.data));
    }
    statById(id, options = {}) {
        return request.request(orange_request_1.HttpMethod.GET, this.endpoint, {
            progress: options.progress,
            params: { stat: true, id: id },
            token: this._token
        }).then(getResponse).then(res => {
            return res.json();
        }).then(i => new file_info_1.FileInfo(i.data));
    }
    list(path, options = {}) {
        var req = request.request(orange_request_1.HttpMethod.GET, this._toUrl(path), orange_1.extend({}, options, {
            token: this._token
        }));
        var getResponse = (res) => {
            if (!res.isValid) {
                if (/text\/plain/.test(res.headers.get('Content-Type'))) {
                    return res.text().then(t => {
                        return Promise.reject(new Error(t));
                    });
                }
                else if (/application\/json/.test(res.headers.get('Content-Type'))) {
                    return res.json().then(json => {
                        return Promise.reject(new Error(json));
                    });
                }
            }
            return res.json();
        };
        return req.then(res => {
            return getResponse(res);
        }).then(infos => {
            if (infos.message != 'ok')
                return [];
            return infos.data.map(i => new file_info_1.FileInfo(i));
        });
    }
    open(path, options = {}) {
        return this.stat(path, orange_1.extend({}, options, {
            token: this._token
        }))
            .then(info => {
            let r = {
                progress: options.progress,
                token: this.token
            };
            if (options.thumbnail) {
                r.params = r.params || {};
                r.params.thumbnail = true;
            }
            return request.request(orange_request_1.HttpMethod.GET, this._toUrl(path), r)
                .then(r => utils_1.isNode ? r.stream() : r.blob());
        });
    }
    remove(path) {
        let url = this._toUrl(path);
        return request.request(orange_request_1.HttpMethod.DELETE, url, {
            token: this.token
        }).then(getResponse)
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
function getResponse(res) {
    if (!res.isValid) {
        if (/text\/plain/.test(res.headers.get('Content-Type'))) {
            return res.text().then(t => {
                return Promise.reject(new Error(t));
            });
        }
        else if (/application\/json/.test(res.headers.get('Content-Type'))) {
            return res.json().then(json => {
                return Promise.reject(new error_1.TorstenJSONError("response", json));
            });
        }
    }
    return Promise.resolve(res);
}
