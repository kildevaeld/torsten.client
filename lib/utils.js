"use strict";

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var orange_1 = require('orange');

var ReadableStream = function ReadableStream() {
    _classCallCheck(this, ReadableStream);
};

exports.ReadableStream = ReadableStream;
exports.isNode = !new Function("try {return this===window;}catch(e){ return false;}")();
var orange_2 = require('orange');
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
        /*for i, c := range str {
            if m&(1<<uint(32-1-i)) != 0 {
                buf[w] = byte(c)
                w++
            }
        }*/
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