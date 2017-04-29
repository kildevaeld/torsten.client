"use strict";

var _charMap;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

Object.defineProperty(exports, "__esModule", { value: true });
var orange_1 = require("orange");
var orange_2 = require("orange");
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
        ch = ch.replace(/[^\w\s$*_+~.()'"!\-:@\/]/g, '');
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