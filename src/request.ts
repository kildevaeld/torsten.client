
import { HttpRequest, HttpMethod, Response } from 'orange.request'
import { Request } from './types';
import { isString, isBuffer, isFormData, isObject, isFile, isReadableStream, isNode } from './utils';

export interface TorstenRequest extends Request {
    token: string;
}

export function request(method: HttpMethod, url: string, r: TorstenRequest): Promise<Response> {
    let req = new HttpRequest(method, url);

    if (r.params) req.params(r.params);
    if (r.headers) req.header(r.headers);

    if (isNode) {
        req.header("User-Agent", "torsten-client/0.0.1")
    }

    req.header("Authorization", "Bearer " + r.token)

    if (method === HttpMethod.POST || method === HttpMethod.PUT) {
        req.uploadProgress(r.progress)
        return _upload(req, r);
    }

    return req.downloadProgress(r.progress)
        .end(r.data).then((res) => {
            return res;
        }) as Promise<Response>;
}

function _upload(req: HttpRequest, options: TorstenRequest): Promise<Response> {

    let mimeType, length, data = options.data;

    if (isString(data)) {
        length = data.length;
        mimeType = options.mime || "text/plain";
    } else if (isBuffer(data)) {
        length = data.length;
        mimeType = options.mime || "text/plain";
    } else if (isObject(data) && (!isFile(data) && !isFormData(data) && !isReadableStream(data))) {
        try {
            data = JSON.stringify(data);
            length = data.length;
            mimeType = "application/json";
        } catch (e) {
            return Promise.reject<any>(e);
        }
    }

    if (length) {
        req.header('Content-Length', "" + length)
    }

    if (isFile(data)) {
        let form = new FormData();
        form.append('file', data);
        data = form;
    }

    if (mimeType && !isFormData(data)) {
        req.header('Content-Type', mimeType);
    }

    return req.end(data) as Promise<Response>;
}
