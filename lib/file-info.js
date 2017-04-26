"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });
var orange_1 = require("orange");
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