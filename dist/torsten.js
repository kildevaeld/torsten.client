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
/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	function __export(m) {
	    for (var p in m) {
	        if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	    }
	}
	Object.defineProperty(exports, "__esModule", { value: true });
	__export(__webpack_require__(1));
	__export(__webpack_require__(2));
	__export(__webpack_require__(6));
	var utils_1 = __webpack_require__(4);
	exports.readBlobAsText = utils_1.readBlobAsText;
	exports.readBlobAsArrayBuffer = utils_1.readBlobAsArrayBuffer;
	exports.readBlobAsDataURL = utils_1.readBlobAsDataURL;
	exports.path = utils_1.path;
	__export(__webpack_require__(5));

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	Object.defineProperty(exports, "__esModule", { value: true });
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

/***/ }),
/* 2 */
/***/ (function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", { value: true });
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

/***/ }),
/* 3 */
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_3__;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	var _charMap;

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	Object.defineProperty(exports, "__esModule", { value: true });
	var orange_1 = __webpack_require__(3);
	var orange_2 = __webpack_require__(3);
	exports.isObject = orange_2.isObject;
	exports.isString = orange_2.isString;
	exports.isFunction = orange_2.isFunction;
	exports.isNode = !new Function("try {return this===window;}catch(e){ return false;}")();
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
	var charMap = (_charMap = {
	    // latin
	    'À': 'A', 'Á': 'A', 'Â': 'A', 'Ã': 'A', 'Ä': 'A', 'Å': 'A', 'Æ': 'AE',
	    'Ç': 'C', 'È': 'E', 'É': 'E', 'Ê': 'E', 'Ë': 'E', 'Ì': 'I', 'Í': 'I',
	    'Î': 'I', 'Ï': 'I', 'Ð': 'D', 'Ñ': 'N', 'Ò': 'O', 'Ó': 'O', 'Ô': 'O',
	    'Õ': 'O', 'Ö': 'O', 'Ő': 'O', 'Ø': 'O', 'Ù': 'U', 'Ú': 'U', 'Û': 'U',
	    'Ü': 'U', 'Ű': 'U', 'Ý': 'Y', 'Þ': 'TH', 'ß': 'ss', 'à': 'a', 'á': 'a',
	    'â': 'a', 'ã': 'a', 'ä': 'a', 'å': 'a', 'æ': 'ae', 'ç': 'c', 'è': 'e',
	    'é': 'e', 'ê': 'e', 'ë': 'e', 'ì': 'i', 'í': 'i', 'î': 'i', 'ï': 'i',
	    'ð': 'd', 'ñ': 'n', 'ò': 'o', 'ó': 'o', 'ô': 'o', 'õ': 'o', 'ö': 'o',
	    'ő': 'o', 'ø': 'o', 'ù': 'u', 'ú': 'u', 'û': 'u', 'ü': 'u', 'ű': 'u',
	    'ý': 'y', 'þ': 'th', 'ÿ': 'y', 'ẞ': 'SS',
	    // greek
	    'α': 'a', 'β': 'b', 'γ': 'g', 'δ': 'd', 'ε': 'e', 'ζ': 'z', 'η': 'h', 'θ': '8',
	    'ι': 'i', 'κ': 'k', 'λ': 'l', 'μ': 'm', 'ν': 'n', 'ξ': '3', 'ο': 'o', 'π': 'p',
	    'ρ': 'r', 'σ': 's', 'τ': 't', 'υ': 'y', 'φ': 'f', 'χ': 'x', 'ψ': 'ps', 'ω': 'w',
	    'ά': 'a', 'έ': 'e', 'ί': 'i', 'ό': 'o', 'ύ': 'y', 'ή': 'h', 'ώ': 'w', 'ς': 's',
	    'ϊ': 'i', 'ΰ': 'y', 'ϋ': 'y', 'ΐ': 'i',
	    'Α': 'A', 'Β': 'B', 'Γ': 'G', 'Δ': 'D', 'Ε': 'E', 'Ζ': 'Z', 'Η': 'H', 'Θ': '8',
	    'Ι': 'I', 'Κ': 'K', 'Λ': 'L', 'Μ': 'M', 'Ν': 'N', 'Ξ': '3', 'Ο': 'O', 'Π': 'P',
	    'Ρ': 'R', 'Σ': 'S', 'Τ': 'T', 'Υ': 'Y', 'Φ': 'F', 'Χ': 'X', 'Ψ': 'PS', 'Ω': 'W',
	    'Ά': 'A', 'Έ': 'E', 'Ί': 'I', 'Ό': 'O', 'Ύ': 'Y', 'Ή': 'H', 'Ώ': 'W', 'Ϊ': 'I',
	    'Ϋ': 'Y',
	    // turkish
	    'ş': 's', 'Ş': 'S', 'ı': 'i', 'İ': 'I' }, _defineProperty(_charMap, "\xE7", 'c'), _defineProperty(_charMap, "\xC7", 'C'), _defineProperty(_charMap, "\xFC", 'u'), _defineProperty(_charMap, "\xDC", 'U'), _defineProperty(_charMap, "\xF6", 'o'), _defineProperty(_charMap, "\xD6", 'O'), _defineProperty(_charMap, 'ğ', 'g'), _defineProperty(_charMap, 'Ğ', 'G'), _defineProperty(_charMap, 'а', 'a'), _defineProperty(_charMap, 'б', 'b'), _defineProperty(_charMap, 'в', 'v'), _defineProperty(_charMap, 'г', 'g'), _defineProperty(_charMap, 'д', 'd'), _defineProperty(_charMap, 'е', 'e'), _defineProperty(_charMap, 'ё', 'yo'), _defineProperty(_charMap, 'ж', 'zh'), _defineProperty(_charMap, 'з', 'z'), _defineProperty(_charMap, 'и', 'i'), _defineProperty(_charMap, 'й', 'j'), _defineProperty(_charMap, 'к', 'k'), _defineProperty(_charMap, 'л', 'l'), _defineProperty(_charMap, 'м', 'm'), _defineProperty(_charMap, 'н', 'n'), _defineProperty(_charMap, 'о', 'o'), _defineProperty(_charMap, 'п', 'p'), _defineProperty(_charMap, 'р', 'r'), _defineProperty(_charMap, 'с', 's'), _defineProperty(_charMap, 'т', 't'), _defineProperty(_charMap, 'у', 'u'), _defineProperty(_charMap, 'ф', 'f'), _defineProperty(_charMap, 'х', 'h'), _defineProperty(_charMap, 'ц', 'c'), _defineProperty(_charMap, 'ч', 'ch'), _defineProperty(_charMap, 'ш', 'sh'), _defineProperty(_charMap, 'щ', 'sh'), _defineProperty(_charMap, 'ъ', 'u'), _defineProperty(_charMap, 'ы', 'y'), _defineProperty(_charMap, 'ь', ''), _defineProperty(_charMap, 'э', 'e'), _defineProperty(_charMap, 'ю', 'yu'), _defineProperty(_charMap, 'я', 'ya'), _defineProperty(_charMap, 'А', 'A'), _defineProperty(_charMap, 'Б', 'B'), _defineProperty(_charMap, 'В', 'V'), _defineProperty(_charMap, 'Г', 'G'), _defineProperty(_charMap, 'Д', 'D'), _defineProperty(_charMap, 'Е', 'E'), _defineProperty(_charMap, 'Ё', 'Yo'), _defineProperty(_charMap, 'Ж', 'Zh'), _defineProperty(_charMap, 'З', 'Z'), _defineProperty(_charMap, 'И', 'I'), _defineProperty(_charMap, 'Й', 'J'), _defineProperty(_charMap, 'К', 'K'), _defineProperty(_charMap, 'Л', 'L'), _defineProperty(_charMap, 'М', 'M'), _defineProperty(_charMap, 'Н', 'N'), _defineProperty(_charMap, 'О', 'O'), _defineProperty(_charMap, 'П', 'P'), _defineProperty(_charMap, 'Р', 'R'), _defineProperty(_charMap, 'С', 'S'), _defineProperty(_charMap, 'Т', 'T'), _defineProperty(_charMap, 'У', 'U'), _defineProperty(_charMap, 'Ф', 'F'), _defineProperty(_charMap, 'Х', 'H'), _defineProperty(_charMap, 'Ц', 'C'), _defineProperty(_charMap, 'Ч', 'Ch'), _defineProperty(_charMap, 'Ш', 'Sh'), _defineProperty(_charMap, 'Щ', 'Sh'), _defineProperty(_charMap, 'Ъ', 'U'), _defineProperty(_charMap, 'Ы', 'Y'), _defineProperty(_charMap, 'Ь', ''), _defineProperty(_charMap, 'Э', 'E'), _defineProperty(_charMap, 'Ю', 'Yu'), _defineProperty(_charMap, 'Я', 'Ya'), _defineProperty(_charMap, 'Є', 'Ye'), _defineProperty(_charMap, 'І', 'I'), _defineProperty(_charMap, 'Ї', 'Yi'), _defineProperty(_charMap, 'Ґ', 'G'), _defineProperty(_charMap, 'є', 'ye'), _defineProperty(_charMap, 'і', 'i'), _defineProperty(_charMap, 'ї', 'yi'), _defineProperty(_charMap, 'ґ', 'g'), _defineProperty(_charMap, 'č', 'c'), _defineProperty(_charMap, 'ď', 'd'), _defineProperty(_charMap, 'ě', 'e'), _defineProperty(_charMap, 'ň', 'n'), _defineProperty(_charMap, 'ř', 'r'), _defineProperty(_charMap, 'š', 's'), _defineProperty(_charMap, 'ť', 't'), _defineProperty(_charMap, 'ů', 'u'), _defineProperty(_charMap, 'ž', 'z'), _defineProperty(_charMap, 'Č', 'C'), _defineProperty(_charMap, 'Ď', 'D'), _defineProperty(_charMap, 'Ě', 'E'), _defineProperty(_charMap, 'Ň', 'N'), _defineProperty(_charMap, 'Ř', 'R'), _defineProperty(_charMap, 'Š', 'S'), _defineProperty(_charMap, 'Ť', 'T'), _defineProperty(_charMap, 'Ů', 'U'), _defineProperty(_charMap, 'Ž', 'Z'), _defineProperty(_charMap, 'ą', 'a'), _defineProperty(_charMap, 'ć', 'c'), _defineProperty(_charMap, 'ę', 'e'), _defineProperty(_charMap, 'ł', 'l'), _defineProperty(_charMap, 'ń', 'n'), _defineProperty(_charMap, "\xF3", 'o'), _defineProperty(_charMap, 'ś', 's'), _defineProperty(_charMap, 'ź', 'z'), _defineProperty(_charMap, 'ż', 'z'), _defineProperty(_charMap, 'Ą', 'A'), _defineProperty(_charMap, 'Ć', 'C'), _defineProperty(_charMap, 'Ę', 'e'), _defineProperty(_charMap, 'Ł', 'L'), _defineProperty(_charMap, 'Ń', 'N'), _defineProperty(_charMap, 'Ś', 'S'), _defineProperty(_charMap, 'Ź', 'Z'), _defineProperty(_charMap, 'Ż', 'Z'), _defineProperty(_charMap, 'ā', 'a'), _defineProperty(_charMap, "\u010D", 'c'), _defineProperty(_charMap, 'ē', 'e'), _defineProperty(_charMap, 'ģ', 'g'), _defineProperty(_charMap, 'ī', 'i'), _defineProperty(_charMap, 'ķ', 'k'), _defineProperty(_charMap, 'ļ', 'l'), _defineProperty(_charMap, 'ņ', 'n'), _defineProperty(_charMap, "\u0161", 's'), _defineProperty(_charMap, 'ū', 'u'), _defineProperty(_charMap, "\u017E", 'z'), _defineProperty(_charMap, 'Ā', 'A'), _defineProperty(_charMap, "\u010C", 'C'), _defineProperty(_charMap, 'Ē', 'E'), _defineProperty(_charMap, 'Ģ', 'G'), _defineProperty(_charMap, 'Ī', 'i'), _defineProperty(_charMap, 'Ķ', 'k'), _defineProperty(_charMap, 'Ļ', 'L'), _defineProperty(_charMap, 'Ņ', 'N'), _defineProperty(_charMap, "\u0160", 'S'), _defineProperty(_charMap, 'Ū', 'u'), _defineProperty(_charMap, "\u017D", 'Z'), _defineProperty(_charMap, '€', 'euro'), _defineProperty(_charMap, '₢', 'cruzeiro'), _defineProperty(_charMap, '₣', 'french franc'), _defineProperty(_charMap, '£', 'pound'), _defineProperty(_charMap, '₤', 'lira'), _defineProperty(_charMap, '₥', 'mill'), _defineProperty(_charMap, '₦', 'naira'), _defineProperty(_charMap, '₧', 'peseta'), _defineProperty(_charMap, '₨', 'rupee'), _defineProperty(_charMap, '₩', 'won'), _defineProperty(_charMap, '₪', 'new shequel'), _defineProperty(_charMap, '₫', 'dong'), _defineProperty(_charMap, '₭', 'kip'), _defineProperty(_charMap, '₮', 'tugrik'), _defineProperty(_charMap, '₯', 'drachma'), _defineProperty(_charMap, '₰', 'penny'), _defineProperty(_charMap, '₱', 'peso'), _defineProperty(_charMap, '₲', 'guarani'), _defineProperty(_charMap, '₳', 'austral'), _defineProperty(_charMap, '₴', 'hryvnia'), _defineProperty(_charMap, '₵', 'cedi'), _defineProperty(_charMap, '¢', 'cent'), _defineProperty(_charMap, '¥', 'yen'), _defineProperty(_charMap, '元', 'yuan'), _defineProperty(_charMap, '円', 'yen'), _defineProperty(_charMap, '﷼', 'rial'), _defineProperty(_charMap, '₠', 'ecu'), _defineProperty(_charMap, '¤', 'currency'), _defineProperty(_charMap, '฿', 'baht'), _defineProperty(_charMap, '$', 'dollar'), _defineProperty(_charMap, '©', '(c)'), _defineProperty(_charMap, 'œ', 'oe'), _defineProperty(_charMap, 'Œ', 'OE'), _defineProperty(_charMap, '∑', 'sum'), _defineProperty(_charMap, '®', '(r)'), _defineProperty(_charMap, '†', '+'), _defineProperty(_charMap, '“', '"'), _defineProperty(_charMap, '”', '"'), _defineProperty(_charMap, '‘', "'"), _defineProperty(_charMap, '’', "'"), _defineProperty(_charMap, '∂', 'd'), _defineProperty(_charMap, 'ƒ', 'f'), _defineProperty(_charMap, '™', 'tm'), _defineProperty(_charMap, '℠', 'sm'), _defineProperty(_charMap, '…', '...'), _defineProperty(_charMap, '˚', 'o'), _defineProperty(_charMap, 'º', 'o'), _defineProperty(_charMap, 'ª', 'a'), _defineProperty(_charMap, '•', '*'), _defineProperty(_charMap, '∆', 'delta'), _defineProperty(_charMap, '∞', 'infinity'), _defineProperty(_charMap, '♥', 'love'), _defineProperty(_charMap, '&', 'and'), _defineProperty(_charMap, '|', 'or'), _defineProperty(_charMap, '<', 'less'), _defineProperty(_charMap, '>', 'greater'), _charMap);
	function slugify(str) {
	    var replacement = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '-';

	    return str.split('').reduce(function (result, ch) {
	        if (charMap[ch]) {
	            ch = charMap[ch];
	        }
	        // allowed
	        ch = ch.replace(/[^\w\s$*_+~.()'"!\-:@]/g, '');
	        result += ch;
	        return result;
	    }, '').replace(/^\s+|\s+$/g, '').replace(/[-\s]+/g, replacement).replace('#{replacement}$', '');
	}
	exports.slugify = slugify;
	function extendSlugChar(customMap) {
	    for (var key in customMap) {
	        charMap[key] = customMap[key];
	    }
	}
	exports.extendSlugChar = extendSlugChar;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	Object.defineProperty(exports, "__esModule", { value: true });
	var orange_1 = __webpack_require__(3);
	var props = ['name', 'mime', 'size', 'ctime', 'mtime', 'mode', 'gid', 'uid', 'meta', 'path', 'is_dir', 'hidden', 'id'];

	var FileInfo = function () {
	    _createClass(FileInfo, [{
	        key: "fullPath",
	        get: function get() {
	            if (!this.path) return this.name;
	            return this.path + (this.path[this.path.length - 1] === '/' ? '' : '/') + this.name;
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
	            return "FileInfo(name=" + this.name + ", mime=" + this.mime + ", size=" + this.size + ")";
	        }
	    }, {
	        key: "toJSON",
	        value: function toJSON() {
	            return orange_1.pick(this, props);
	        }
	    }]);

	    return FileInfo;
	}();

	exports.FileInfo = FileInfo;

/***/ }),
/* 6 */
/***/ (function(module, exports) {

	"use strict";

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	Object.defineProperty(exports, "__esModule", { value: true });
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

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", { value: true });
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

/***/ }),
/* 8 */
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_8__;

/***/ })
/******/ ])
});
;