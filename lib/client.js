"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var orange_1 = require('orange');
var utils_1 = require('./utils');
var file_info_1 = require('./file-info');
var error_1 = require('./error');
var request = require('./request');
var orange_request_1 = require('orange.request');
function validateConfig(options) {
    if (options == null) throw error_1.createError(0, "options");
}

var TorstenClient = function () {
    function TorstenClient(options) {
        _classCallCheck(this, TorstenClient);

        validateConfig(options);
        this._options = options;
        if (options.token) this.token = options.token;
    }

    _createClass(TorstenClient, [{
        key: 'create',
        value: function create(path, data) {
            var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

            if (data == null) return Promise.reject(error_1.createError(error_1.ErrorCode.NullData, "no data"));
            var req = orange_1.extend({}, options, {
                token: this.token
            });
            if (options.mode) {
                (req.params = req.params || {}).mode = options.mode;
            }
            if (options.meta) {
                (req.params = req.params || {}).meta = JSON.stringify(options.meta);
            }
            return request.upload(this._toUrl(path), req, data).then(getResponse).then(function (res) {
                return res.json();
            }).then(function (json) {
                if (json.message != "ok") {
                    throw error_1.createError(error_1.ErrorCode.Unknown, "invalid response: " + json.message);
                }
                return json.data;
            });
        }
    }, {
        key: 'stat',
        value: function stat(path) {
            var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            var url = this._toUrl(path);
            return request.request(orange_request_1.HttpMethod.GET, url, {
                progress: options.progress,
                params: { stat: true },
                token: this._token
            }).then(getResponse).then(function (res) {
                return res.json();
            }).then(function (i) {
                return new file_info_1.FileInfo(i.data);
            });
        }
    }, {
        key: 'statById',
        value: function statById(id) {
            var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            return request.request(orange_request_1.HttpMethod.GET, this._toUrl('/'), {
                progress: options.progress,
                params: { stat: true, id: id },
                token: this._token
            }).then(getResponse).then(function (res) {
                return res.json();
            }).then(function (i) {
                return new file_info_1.FileInfo(i.data);
            });
        }
    }, {
        key: 'list',
        value: function list(path) {
            var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            var req = request.request(orange_request_1.HttpMethod.GET, this._toUrl(path), orange_1.extend({}, options, {
                token: this._token
            }));
            return req.then(getResponse).then(function (res) {
                return res.json();
            }).then(function (infos) {
                if (infos.message != 'ok') return [];
                return infos.data.map(function (i) {
                    return new file_info_1.FileInfo(i);
                });
            });
        }
    }, {
        key: 'open',
        value: function open(path) {
            var _this = this;

            var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            return this.stat(path, orange_1.extend({}, options, {
                token: this._token
            })).then(function (info) {
                var r = {
                    progress: options.progress,
                    token: _this.token
                };
                if (options.thumbnail) {
                    r.params = r.params || {};
                    r.params.thumbnail = true;
                }
                return request.request(orange_request_1.HttpMethod.GET, _this._toUrl(path), r).then(function (r) {
                    return utils_1.isNode ? r.stream() : r.blob();
                });
            });
        }
    }, {
        key: 'remove',
        value: function remove(path) {
            var url = this._toUrl(path);
            return request.request(orange_request_1.HttpMethod.DELETE, url, {
                token: this.token
            }).then(getResponse).then(function (res) {
                return res.json();
            });
        }
    }, {
        key: '_toUrl',
        value: function _toUrl(path) {
            if (path == null) {
                throw new Error('no path');
            }
            if (path.substr(0, 1) != "/") {
                path = "/" + path;
            }
            path = "/v1" + path;
            return this._options.endpoint + path;
        }
    }, {
        key: 'token',
        set: function set(token) {
            this._token = token;
        },
        get: function get() {
            return this._token;
        }
    }, {
        key: 'endpoint',
        get: function get() {
            return this._options.endpoint;
        }
    }]);

    return TorstenClient;
}();

exports.TorstenClient = TorstenClient;
function getResponse(res) {
    if (!res.isValid) {
        switch (res.status) {
            case error_1.ErrorCode.NotFound:
                return Promise.reject(error_1.createError(error_1.ErrorCode.NotFound, "Not Found"));
            case error_1.ErrorCode.AlreadyExists:
                return Promise.reject(error_1.createError(error_1.ErrorCode.AlreadyExists, "Already Exists"));
            case error_1.ErrorCode.Unauthorized:
                return Promise.reject(error_1.createError(error_1.ErrorCode.Unauthorized, "Unauthorized"));
        }
        if (/text\/plain/.test(res.headers.get('Content-Type'))) {
            return res.text().then(function (t) {
                return Promise.reject(error_1.createError(error_1.ErrorCode.Unknown, t));
            });
        } else if (/application\/json/.test(res.headers.get('Content-Type'))) {
            return res.json().then(function (json) {
                return Promise.reject(new error_1.TorstenJSONError(error_1.ErrorCode.Unknown, "response", json));
            });
        }
    }
    return Promise.resolve(res);
}