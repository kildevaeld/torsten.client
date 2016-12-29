(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("orange"), require("orange.request"));
	else if(typeof define === 'function' && define.amd)
		define(["orange", "orange.request"], factory);
	else if(typeof exports === 'object')
		exports["torsten"] = factory(require("orange"), require("orange.request"));
	else
		root["torsten"] = factory(root["orange"], root["orange"]["request"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_3__, __WEBPACK_EXTERNAL_MODULE_8__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	function __export(m) {
	    for (var p in m) {
	        if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	    }
	}
	__export(__webpack_require__(1));
	__export(__webpack_require__(2));
	__export(__webpack_require__(6));
	var utils_1 = __webpack_require__(4);
	exports.readBlobAsText = utils_1.readBlobAsText;
	exports.readBlobAsArrayBuffer = utils_1.readBlobAsArrayBuffer;
	exports.readBlobAsDataURL = utils_1.readBlobAsDataURL;
	exports.path = utils_1.path;
	__export(__webpack_require__(5));

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var types_1 = __webpack_require__(2);
	var orange_1 = __webpack_require__(3);
	var utils_1 = __webpack_require__(4);
	var file_info_1 = __webpack_require__(5);
	var error_1 = __webpack_require__(6);
	var request = __webpack_require__(7);
	var orange_request_1 = __webpack_require__(8);
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
	            return request.request(orange_request_1.HttpMethod.POST, this._toUrl(path), req).then(getResponse).then(function (res) {
	                return res.json();
	            }).then(function (json) {
	                if (json.message != types_1.constants.MessageOK) {
	                    throw error_1.createError(error_1.ErrorCode.Unknown, "invalid response: " + json.message);
	                }
	                return new file_info_1.FileInfo(json.data);
	            });
	        }
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

/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";

	var FileMode;
	(function (FileMode) {
	    FileMode[FileMode["UserRead"] = 256] = "UserRead";
	    FileMode[FileMode["UserWrite"] = 128] = "UserWrite";
	    FileMode[FileMode["UserDelete"] = 64] = "UserDelete";
	    FileMode[FileMode["GroupRead"] = 32] = "GroupRead";
	    FileMode[FileMode["GroupWrite"] = 16] = "GroupWrite";
	    FileMode[FileMode["GroupDelete"] = 8] = "GroupDelete";
	    FileMode[FileMode["OtherRead"] = 4] = "OtherRead";
	    FileMode[FileMode["OtherWriter"] = 2] = "OtherWriter";
	    FileMode[FileMode["OtherDelete"] = 0] = "OtherDelete";
	})(FileMode = exports.FileMode || (exports.FileMode = {}));
	;
	var constants;
	(function (constants) {
	    constants.MessageOK = "ok";
	})(constants = exports.constants || (exports.constants = {}));

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_3__;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	var orange_1 = __webpack_require__(3);
	exports.isNode = !new Function("try {return this===window;}catch(e){ return false;}")();
	var orange_2 = __webpack_require__(3);
	exports.isObject = orange_2.isObject;
	exports.isString = orange_2.isString;
	exports.isFunction = orange_2.isFunction;
	function isBuffer(a) {
	    if (exports.isNode) Buffer.isBuffer(a);
	    return false;
	}
	exports.isBuffer = isBuffer;
	function isFormData(a) {
	    if (exports.isNode) return false;
	    return a instanceof FormData;
	}
	exports.isFormData = isFormData;
	function isReadableStream(a) {
	    if (typeof a.read === 'function' && typeof a.pipe === 'function') {
	        return true;
	    }
	    return false;
	}
	exports.isReadableStream = isReadableStream;
	function isFile(a) {
	    if (exports.isNode) return false;
	    if (a instanceof File) return true;
	    return false;
	}
	exports.isFile = isFile;
	function fileReaderReady(reader) {
	    return new orange_1.Promise(function (resolve, reject) {
	        reader.onload = function () {
	            resolve(reader.result);
	        };
	        reader.onerror = function () {
	            reject(reader.error);
	        };
	    });
	}
	exports.fileReaderReady = fileReaderReady;
	function readBlobAsArrayBuffer(blob) {
	    var reader = new FileReader();
	    reader.readAsArrayBuffer(blob);
	    return fileReaderReady(reader);
	}
	exports.readBlobAsArrayBuffer = readBlobAsArrayBuffer;
	function readBlobAsText(blob) {
	    var reader = new FileReader();
	    reader.readAsText(blob);
	    return fileReaderReady(reader);
	}
	exports.readBlobAsText = readBlobAsText;
	function readBlobAsDataURL(blob) {
	    var reader = new FileReader();
	    reader.readAsDataURL(blob);
	    return fileReaderReady(reader);
	}
	exports.readBlobAsDataURL = readBlobAsDataURL;
	var path;
	(function (path_1) {
	    path_1.DELIMITER = "/";
	    function join() {
	        var out = [];

	        for (var _len = arguments.length, parts = Array(_len), _key = 0; _key < _len; _key++) {
	            parts[_key] = arguments[_key];
	        }

	        for (var i = 0, ii = parts.length; i < ii; i++) {
	            var s = 0,
	                e = parts[i].length;
	            if (parts[i] === path_1.DELIMITER || parts[i] === '') continue;
	            if (parts[i][0] === path_1.DELIMITER) s = 1;
	            if (parts[i][e - 1] === path_1.DELIMITER) e--;
	            out.push(parts[i].substring(s, e));
	        }
	        return path_1.DELIMITER + out.join(path_1.DELIMITER);
	    }
	    path_1.join = join;
	    function base(path) {
	        if (!path) return "";
	        var split = path.split(path_1.DELIMITER);
	        return split[split.length - 1];
	    }
	    path_1.base = base;
	    function dir(path) {
	        if (!path) return "";
	        var split = path.split(path_1.DELIMITER);
	        split.pop();
	        return join.apply(undefined, _toConsumableArray(split));
	    }
	    path_1.dir = dir;
	})(path = exports.path || (exports.path = {}));
	var filemode;
	(function (filemode) {
	    function toString(m) {
	        var str = "dalTLDpSugct";
	        var buf = new Array(32);
	        //var buf [32]byte // Mode is uint32.
	        var w = 0;
	        for (var i = 0, ii = str.length; i < ii; i++) {
	            var c = str[i];
	            if ((m & 1 << 32 - 1 - i) != 0) {
	                buf[w] = c;
	                w++;
	            }
	        }
	        if (w == 0) {
	            buf[w] = '-';
	            w++;
	        }
	        var rwx = "rwxrwxrwx";
	        for (var _i = 0, _ii = rwx.length; _i < _ii; _i++) {
	            var _c = str[_i];
	            if ((m & 1 << 9 - 1 - _i) != 0) {
	                buf[w] = _c;
	            } else {
	                buf[w] = '-';
	            }
	            w++;
	        }
	        return buf.slice(0, w).join('');
	    }
	    filemode.toString = toString;
	})(filemode = exports.filemode || (exports.filemode = {}));

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var orange_1 = __webpack_require__(3);
	var props = ['name', 'mime', 'size', 'ctime', 'mtime', 'mode', 'gid', 'uid', 'meta', 'path', 'is_dir', 'hidden', 'id'];

	var FileInfo = function () {
	    _createClass(FileInfo, [{
	        key: "fullPath",
	        get: function get() {
	            return this.path + this.name;
	        }
	    }]);

	    function FileInfo() {
	        var _this = this;

	        var attr = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

	        _classCallCheck(this, FileInfo);

	        props.forEach(function (m) {
	            if (orange_1.has(attr, m)) {
	                _this[m] = attr[m];
	            } else {
	                if (m == 'meta') {
	                    _this.meta = {};
	                } else {
	                    throw new Error("property: " + m + " does not exists");
	                }
	            }
	        });
	        if (!(this.ctime instanceof Date)) {
	            this.ctime = new Date(this.ctime);
	        }
	        if (!(this.mtime instanceof Date)) {
	            this.mtime = new Date(this.mtime);
	        }
	    }

	    _createClass(FileInfo, [{
	        key: "toString",
	        value: function toString() {
	            return "FileInfo(name=" + this.name + ", mime=" + this.mime + ")";
	        }
	    }]);

	    return FileInfo;
	}();

	exports.FileInfo = FileInfo;

/***/ },
/* 6 */
/***/ function(module, exports) {

	"use strict";

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var ErrorCode;
	(function (ErrorCode) {
	    ErrorCode[ErrorCode["AlreadyExists"] = 409] = "AlreadyExists";
	    ErrorCode[ErrorCode["NotFound"] = 404] = "NotFound";
	    ErrorCode[ErrorCode["Unauthorized"] = 401] = "Unauthorized";
	    ErrorCode[ErrorCode["Unknown"] = 500] = "Unknown";
	    ErrorCode[ErrorCode["NullData"] = 600] = "NullData";
	})(ErrorCode = exports.ErrorCode || (exports.ErrorCode = {}));

	var TorstenClientError = function (_Error) {
	    _inherits(TorstenClientError, _Error);

	    function TorstenClientError(code, message) {
	        _classCallCheck(this, TorstenClientError);

	        var _this = _possibleConstructorReturn(this, (TorstenClientError.__proto__ || Object.getPrototypeOf(TorstenClientError)).call(this, message));

	        _this.code = code;
	        _this.message = message;
	        return _this;
	    }

	    _createClass(TorstenClientError, [{
	        key: "toJSON",
	        value: function toJSON() {
	            return {
	                message: this.message,
	                code: this.code
	            };
	        }
	    }]);

	    return TorstenClientError;
	}(Error);

	exports.TorstenClientError = TorstenClientError;

	var TorstenJSONError = function (_TorstenClientError) {
	    _inherits(TorstenJSONError, _TorstenClientError);

	    function TorstenJSONError(code, message, json) {
	        _classCallCheck(this, TorstenJSONError);

	        var _this2 = _possibleConstructorReturn(this, (TorstenJSONError.__proto__ || Object.getPrototypeOf(TorstenJSONError)).call(this, code, message));

	        _this2.json = json;
	        return _this2;
	    }

	    _createClass(TorstenJSONError, [{
	        key: "toJSON",
	        value: function toJSON() {
	            return {
	                code: this.code,
	                message: this.message,
	                data: this.json
	            };
	        }
	    }]);

	    return TorstenJSONError;
	}(TorstenClientError);

	exports.TorstenJSONError = TorstenJSONError;
	function createError(code, msg) {
	    return new TorstenClientError(code, msg);
	}
	exports.createError = createError;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var orange_request_1 = __webpack_require__(8);
	var utils_1 = __webpack_require__(4);
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

/***/ },
/* 8 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_8__;

/***/ }
/******/ ])
});
;