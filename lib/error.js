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