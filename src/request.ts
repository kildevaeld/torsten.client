
import {HttpRequest, HttpMethod, BodyType, Response} from 'orange.request'
import {IPromise} from 'orange'
import {Request} from './types';
import {isString, isBuffer, isFormData, isObject, isFile, isReadableStream, isNode} from './utils';

export interface TorstenRequest extends Request {
    token: string;
}

export function request(method: HttpMethod, url: string, r: TorstenRequest): IPromise<Response> {
    let req = new HttpRequest(method, url);
    
    if (r.params) req.params(r.params);
    if (r.headers) req.header(r.headers);

    if (isNode) {
        req.header("User-Agent", "torsten-client/0.0.1")
    }
    
    
    req.header("Authorization", "Bearer " + r.token)
    
    return req.downloadProgress(r.progress)
        .end(r.data).then((res) => {
            return res;
        });
}

export function upload(url: string, r: TorstenRequest, data): IPromise<Response> {
    
    let req = new HttpRequest(HttpMethod.POST, url);
    req.uploadProgress(r.progress)
    if (r.params) req.params(r.params);
    if (r.headers) req.header(r.headers);

    let mimeType;
    if (isNode) {
        req.header("User-Agent", "torsten-client/0.0.1")
    }
    
    req.header("Authorization", "Bearer " + r.token)

    if (isString(data)) {
        req.header('Content-Length', "" + data.length)
        mimeType = r.mime || "text/plain";
    } else if (isBuffer(data)) {
        req.header('Content-Length', "" + data.length);
    } else if (isObject(data) && !isFile(data) && !isFormData(data) && !isReadableStream(data)) {
        try {
            data = JSON.stringify(data);
            req.header('Content-Length', data.length);
            mimeType = "application/json";
        } catch (e) {
            return Promise.reject<any>(e);
        }
    }
    
    if (isFile(data)) {
    
        let form = new FormData();
        form.append('file', data);
        data = form;
    }

    if (mimeType && !isFormData(data)) {
        req.header('Content-Type', mimeType);
    }
   
    
    return req.end(data);

}