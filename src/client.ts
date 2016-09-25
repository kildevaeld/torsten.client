import {
    TorstenClientOptions, CreateOptions, GetOptions, ListOptions,
    Requester, OpenOptions, IFileInfo, IClient, TorstenResponse
} from './types';
import { extend, isObject, IPromise } from 'orange';
import { isString, isFormData, isReadableStream, isNode, isBuffer } from './utils';
import { FileInfo } from './file-info';
import { createError , TorstenJSONError} from './error';

import * as request from './request'
import { HttpMethod, Response } from 'orange.request';


interface Request {
    mime?: string;
    headers?: any
    params?: any
    data?: any;
    size?: number;
    progress?: (e: ProgressEvent) => void;
}

interface IMessage {
    message: string;
    data?: any;
}


function validateConfig(options: TorstenClientOptions) {
    if (options == null) throw createError("options");

}



export class TorstenClient implements IClient {
    private _options: TorstenClientOptions;
    constructor(options: TorstenClientOptions) {
        validateConfig(options);
        this._options = options;
        if (options.token) this.token = options.token;
    }


    private _token;
    set token(token: string) {
        this._token = token;
    }

    get token(): string {
        return this._token;
    }

    get endpoint() {
        return this._options.endpoint;
    }

    create(path: string, data: any, options: CreateOptions = {}): IPromise<IFileInfo> {
        if (data == null) return Promise.reject<IFileInfo>(createError("no data"))

        let req = extend({}, options, {
            token: this.token
        });

        return request.upload(this._toUrl(path), req, data)
        .then(getResponse)
        .then(res => res.json<IMessage>())
            .then(json => {
                if (json.message != "ok") {
                    throw createError("invalid response");
                }
                return json.data;
            })
    }



    stat(path: string, options: GetOptions = {}): IPromise<IFileInfo> {

        let url = this._toUrl(path);
        return request.request(HttpMethod.GET, url, {
            progress: options.progress,
            params: { stat: true },
            token: this._token
        }).then(getResponse).then(res => {
            return res.json<{ data: IFileInfo }>();
        }).then(i => new FileInfo(i.data))

    }

    statById(id: string, options: GetOptions = {}): IPromise<IFileInfo> {
        return request.request(HttpMethod.GET, this.endpoint, {
            progress: options.progress,
            params: { stat: true, id: id },
            token: this._token
        }).then(getResponse).then(res => {
            return res.json<{ data: IFileInfo }>();
        }).then(i => new FileInfo(i.data))
    }

    list(path: string, options: ListOptions = {}): IPromise<IFileInfo[]> {

        var req = request.request(HttpMethod.GET, this._toUrl(path), extend({}, options, {
            token: this._token
        }))

        var getResponse = (res: Response) => {

            if (!res.isValid) {
                if (/text\/plain/.test(res.headers.get('Content-Type'))) {
                    return res.text().then(t => {
                        return Promise.reject(new Error(t));
                    })
                } else if (/application\/json/.test(res.headers.get('Content-Type'))) {
                    return res.json().then(json => {
                        return Promise.reject(new Error(<any>json));
                    })
                }
            }
            return res.json<{ data: FileInfo[]; message: string; }>();
        }

        return req.then(res => {
            return getResponse(res)
        }).then(infos => {
            if (infos.message != 'ok') return [];
            return infos.data.map(i => new FileInfo(i));
        })
    }


    open(path: string, options: OpenOptions = {}): IPromise<any> {
        return this.stat(path, extend({}, options, {
            token: this._token
        }))
            .then<any>(info => {

                let r: request.TorstenRequest = {
                    progress: options.progress,
                    token: this.token
                };
                if (options.thumbnail) {
                    r.params = r.params || {};
                    r.params.thumbnail = true;
                }

                return request.request(HttpMethod.GET, this._toUrl(path), r)
                    .then(r => isNode ? r.stream() : r.blob())

            });
    }

    remove(path: string): IPromise<TorstenResponse> {
        let url = this._toUrl(path)
        return request.request(HttpMethod.DELETE, url, {
            token: this.token
        }).then(getResponse)
            .then(res => res.json())
    }

    private _toUrl(path: string) {
        if (path.substr(0, 1) != "/") {
            path = "/" + path;
        }
        return this._options.endpoint + path;
    }

}


function getResponse(res: Response): IPromise<Response> {

    if (!res.isValid) {
        if (/text\/plain/.test(res.headers.get('Content-Type'))) {
            return res.text().then(t => {
                return Promise.reject(new Error(t));
            })
        } else if (/application\/json/.test(res.headers.get('Content-Type'))) {
            return res.json().then(json => {
            
                return Promise.reject<Response>(new TorstenJSONError("response",json));
            })
        }
    }
    return Promise.resolve(res);
}