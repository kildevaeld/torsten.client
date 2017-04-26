"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });
var types_1 = require("./types");
var orange_1 = require("orange");
var utils_1 = require("./utils");
var file_info_1 = require("./file-info");
var error_1 = require("./error");
var request = require("./request");
var orange_request_1 = require("orange.request");
function validateConfig(options) {
    if (options == null) throw error_1.createError(0, "options");
    if (options.endpoint == null) throw error_1.createError(0, "needs endpoint");
}

var TorstenClient = function () {
    function TorstenClient(options) {
        _classCallCheck(this, TorstenClient);

        validateConfig(options);
        this._options = options;
        if (options.token) this.token = options.token;
    }

    _createClass(TorstenClient, [{
        key: "create",

        /**
         * Add new file
         *
         * @param {string} path
         * @param {*} data
         * @param {CreateOptions} [options={}]
         * @returns {Promise<FileInfo>}
         *
         * @memberOf TorstenClient
         */
        value: function create(path, data) {
            var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

            this._check_token();
            if (data == null) return Promise.reject(error_1.createError(error_1.ErrorCode.NullData, "no data"));
            var req = orange_1.extend({}, options, {
                token: this.token,
                data: data
            });
            if (options.mode) {
                (req.params = req.params || {}).mode = options.mode;
            }
            if (options.meta) {
                (req.params = req.params || {}).meta = JSON.stringify(options.meta);
            }
            path = utils_1.slugify(path);
            return request.request(orange_request_1.HttpMethod.POST, this._toUrl(path), req).then(getResponse).then(function (res) {
                return res.json();
            }).then(function (json) {
                if (json.message != types_1.constants.MessageOK) {
                    throw error_1.createError(error_1.ErrorCode.Unknown, "invalid response: " + json.message);
                }
                return new file_info_1.FileInfo(json.data);
            });
        }
        /**
         * Stat returns the file info from path
         *
         * @param {string} path
         * @param {GetOptions} [options={}]
         * @returns {Promise<FileInfo>}
         *
         * @memberOf TorstenClient
         */

    }, {
        key: "stat",
        value: function stat(path) {
            var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            this._check_token();
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
        /**
         * StatById return the file info from id
         *
         * @param {string} id
         * @param {GetOptions} [options={}]
         * @returns {Promise<FileInfo>}
         *
         * @memberOf TorstenClient
         */

    }, {
        key: "statById",
        value: function statById(id) {
            var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            this._check_token();
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
        key: "list",
        value: function list(path) {
            var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            this._check_token();
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
        /**
         * Open opens a file for reading.
         * When running on node a ReadableStream will be returned
         * A blob when running in the browser
         *
         * @param {(string | FileInfo)} path
         * @param {OpenOptions} [options={}]
         * @returns {Promise<any>}
         *
         * @memberOf TorstenClient
         */

    }, {
        key: "open",
        value: function open(path) {
            var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            this._check_token();
            var r = {
                progress: options.progress,
                token: this.token
            };
            if (options.thumbnail) {
                r.params = r.params || {};
                r.params.thumbnail = true;
            }
            var p = void 0;
            if (path instanceof file_info_1.FileInfo) {
                p = path.fullPath;
            } else {
                p = path;
            }
            return request.request(orange_request_1.HttpMethod.GET, this._toUrl(p), r).then(function (r) {
                return utils_1.isNode ? r.stream() : r.blob();
            });
        }
        /**
         * Remove a file at path
         *
         * @param {string} path
         * @returns {Promise<TorstenResponse>}
         *
         * @memberOf TorstenClient
         */

    }, {
        key: "remove",
        value: function remove(path) {
            this._check_token();
            var url = this._toUrl(path);
            return request.request(orange_request_1.HttpMethod.DELETE, url, {
                token: this.token
            }).then(getResponse).then(function (res) {
                return res.json();
            });
        }
    }, {
        key: "_toUrl",
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
        key: "_check_token",
        value: function _check_token() {
            if (!this.token) throw error_1.createError(0, "no token");
        }
    }, {
        key: "token",
        set: function set(token) {
            this._token = token;
        },
        get: function get() {
            return this._token;
        }
    }, {
        key: "endpoint",
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
                return Promise.reject(new error_1.TorstenJSONError(error_1.ErrorCode.Unknown, "Unknown JSON Response", json));
            });
        }
    }
    return Promise.resolve(res);
}