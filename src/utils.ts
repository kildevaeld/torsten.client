import { IPromise, Promise } from 'orange'
export { isObject, isString, isFunction } from 'orange'

export declare class Buffer {
    static isBuffer(a): boolean;
    length: number;
}

export declare class ReadableStream { }
export const isNode = !(new Function("try {return this===window;}catch(e){ return false;}"))();


export function isBuffer(a: any): a is Buffer {
    if (isNode) Buffer.isBuffer(a)
    return false
}

export function isFormData(a: any): a is FormData {
    if (isNode) return false;
    return a instanceof FormData;
}

export function isReadableStream(a: any): a is ReadableStream {
    if (typeof a.read === 'function' && typeof a.pipe === 'function') {
        return true
    }
    return false;
}

export function isFile(a: any): a is File {
    if (isNode) return false;
    if (a instanceof File) return true;
    return false;
}

export function fileReaderReady<T>(reader: FileReader): IPromise<T> {
    return new Promise(function (resolve, reject) {
        reader.onload = function () {
            resolve(reader.result)
        }
        reader.onerror = function () {
            reject(reader.error)
        }
    });
}

export function readBlobAsArrayBuffer(blob: Blob): IPromise<ArrayBuffer> {
    var reader = new FileReader()
    reader.readAsArrayBuffer(blob);
    return fileReaderReady(reader)
}

export function readBlobAsText(blob: Blob): IPromise<string> {
    var reader = new FileReader()
    reader.readAsText(blob)

    return fileReaderReady<string>(reader)
}

export function readBlobAsDataURL(blob: Blob): IPromise<string> {
    var reader = new FileReader()
    reader.readAsDataURL(blob);
    return fileReaderReady<string>(reader);
}

export module path {
    export var DELIMITER = "/";

    export function join(...parts: string[]) {
        let out = []
        for (let i = 0, ii = parts.length; i < ii; i++) {
            var s = 0, e = parts[i].length;
            if (parts[i] === DELIMITER || parts[i] === '') continue;
            if (parts[i][0] === DELIMITER) s = 1;
            if (parts[i][e - 1] === DELIMITER) e--;

            out.push(parts[i].substring(s, e))
        }
        return DELIMITER + out.join(DELIMITER);
    }

    export function base(path: string) {
        if (!path) return "";
        let split = path.split(DELIMITER)
        return split[split.length - 1];
    }

    export function dir(path: string) {
        if (!path) return "";
        let split = path.split(DELIMITER)
        split.pop();
        return join(...split);
    }
}

export module filemode {
    export function toString(m: number) {
        const str = "dalTLDpSugct"
        var buf = new Array(32);
        //var buf [32]byte // Mode is uint32.
        let w = 0

        for (let i = 0, ii = str.length; i < ii; i++) {
            let c = str[i];
            if ((m & (1 << (32 - 1 - i))) != 0) {
                buf[w] = c;
                w++
            }
        }

        if (w == 0) {
            buf[w] = '-'
            w++
        }
        const rwx = "rwxrwxrwx"

        for (let i = 0, ii = rwx.length; i < ii; i++) {
            let c = str[i];
            if ((m & (1 << (9 - 1 - i))) != 0) {
                buf[w] = c
            } else {
                buf[w] = '-'
            }
            w++
        }


        return buf.slice(0, w).join('');
    }
}

const charMap = {
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
    'ş': 's', 'Ş': 'S', 'ı': 'i', 'İ': 'I', 'ç': 'c', 'Ç': 'C', 'ü': 'u', 'Ü': 'U',
    'ö': 'o', 'Ö': 'O', 'ğ': 'g', 'Ğ': 'G',
    // russian
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo', 'ж': 'zh',
    'з': 'z', 'и': 'i', 'й': 'j', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o',
    'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'h', 'ц': 'c',
    'ч': 'ch', 'ш': 'sh', 'щ': 'sh', 'ъ': 'u', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu',
    'я': 'ya',
    'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D', 'Е': 'E', 'Ё': 'Yo', 'Ж': 'Zh',
    'З': 'Z', 'И': 'I', 'Й': 'J', 'К': 'K', 'Л': 'L', 'М': 'M', 'Н': 'N', 'О': 'O',
    'П': 'P', 'Р': 'R', 'С': 'S', 'Т': 'T', 'У': 'U', 'Ф': 'F', 'Х': 'H', 'Ц': 'C',
    'Ч': 'Ch', 'Ш': 'Sh', 'Щ': 'Sh', 'Ъ': 'U', 'Ы': 'Y', 'Ь': '', 'Э': 'E', 'Ю': 'Yu',
    'Я': 'Ya',
    // ukranian
    'Є': 'Ye', 'І': 'I', 'Ї': 'Yi', 'Ґ': 'G', 'є': 'ye', 'і': 'i', 'ї': 'yi', 'ґ': 'g',
    // czech
    'č': 'c', 'ď': 'd', 'ě': 'e', 'ň': 'n', 'ř': 'r', 'š': 's', 'ť': 't', 'ů': 'u',
    'ž': 'z', 'Č': 'C', 'Ď': 'D', 'Ě': 'E', 'Ň': 'N', 'Ř': 'R', 'Š': 'S', 'Ť': 'T',
    'Ů': 'U', 'Ž': 'Z',
    // polish
    'ą': 'a', 'ć': 'c', 'ę': 'e', 'ł': 'l', 'ń': 'n', 'ó': 'o', 'ś': 's', 'ź': 'z',
    'ż': 'z', 'Ą': 'A', 'Ć': 'C', 'Ę': 'e', 'Ł': 'L', 'Ń': 'N', 'Ś': 'S',
    'Ź': 'Z', 'Ż': 'Z',
    // latvian
    'ā': 'a', 'č': 'c', 'ē': 'e', 'ģ': 'g', 'ī': 'i', 'ķ': 'k', 'ļ': 'l', 'ņ': 'n',
    'š': 's', 'ū': 'u', 'ž': 'z', 'Ā': 'A', 'Č': 'C', 'Ē': 'E', 'Ģ': 'G', 'Ī': 'i',
    'Ķ': 'k', 'Ļ': 'L', 'Ņ': 'N', 'Š': 'S', 'Ū': 'u', 'Ž': 'Z',
    // currency
    '€': 'euro', '₢': 'cruzeiro', '₣': 'french franc', '£': 'pound',
    '₤': 'lira', '₥': 'mill', '₦': 'naira', '₧': 'peseta', '₨': 'rupee',
    '₩': 'won', '₪': 'new shequel', '₫': 'dong', '₭': 'kip', '₮': 'tugrik',
    '₯': 'drachma', '₰': 'penny', '₱': 'peso', '₲': 'guarani', '₳': 'austral',
    '₴': 'hryvnia', '₵': 'cedi', '¢': 'cent', '¥': 'yen', '元': 'yuan',
    '円': 'yen', '﷼': 'rial', '₠': 'ecu', '¤': 'currency', '฿': 'baht',
    '$': 'dollar',
    // symbols
    '©': '(c)', 'œ': 'oe', 'Œ': 'OE', '∑': 'sum', '®': '(r)', '†': '+',
    '“': '"', '”': '"', '‘': "'", '’': "'", '∂': 'd', 'ƒ': 'f', '™': 'tm',
    '℠': 'sm', '…': '...', '˚': 'o', 'º': 'o', 'ª': 'a', '•': '*',
    '∆': 'delta', '∞': 'infinity', '♥': 'love', '&': 'and', '|': 'or',
    '<': 'less', '>': 'greater'
};

export function slugify(str: string, replacement = '-') {
    return str.split('').reduce(function (result, ch) {
        if (charMap[ch]) {
            ch = charMap[ch]
        }
        // allowed
        ch = ch.replace(/[^\w\s$*_+~.()'"!\-:@\/]/g, '')
        result += ch
        return result
    }, '')
        // trim leading/trailing spaces
        .replace(/^\s+|\s+$/g, '')
        // convert spaces
        .replace(/[-\s]+/g, replacement)
        // remove trailing separator
        .replace('#{replacement}$', '')
}

export function extendSlugChar(customMap: { [key: string]: string }) {
    for (var key in customMap) {
        charMap[key] = customMap[key]
    }
}