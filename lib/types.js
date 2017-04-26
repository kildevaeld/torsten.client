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