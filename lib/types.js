"use strict";
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
})(exports.FileMode || (exports.FileMode = {}));
var FileMode = exports.FileMode;
;
