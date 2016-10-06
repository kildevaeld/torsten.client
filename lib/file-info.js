"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var orange_1 = require('orange');
var props = ['name', 'mime', 'size', 'ctime', 'mtime', 'mode', 'gid', 'uid', 'meta', 'path', 'is_dir', 'hidden', 'id'];

var FileInfo = function () {
    function FileInfo() {
        var _this = this;

        var attr = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, FileInfo);

        props.forEach(function (m) {
            if (orange_1.has(attr, m)) {
                _this[m] = attr[m];
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
        key: 'fullPath',
        get: function get() {
            return this.path + this.name;
        }
    }]);

    return FileInfo;
}();

exports.FileInfo = FileInfo;