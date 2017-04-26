import {
    TorstenClientOptions, CreateOptions, GetOptions, ListOptions,
    OpenOptions, IFileInfo, IClient, TorstenResponse,
    constants
} from './types';
import { extend } from 'orange';
import { isNode, slugify } from './utils';
import { FileInfo } from './file-info';
import { createError, TorstenJSONError, ErrorCode } from './error';

import * as request from './request'
import { HttpMethod, Response } from 'orange.request';


interface IMessage {
    message: string;
    data?: any;
}

function validateConfig(options: TorstenClientOptions) {
    if (options == null) throw createError(0, "options");
    if (options.endpoint == null) throw createError(0, "needs endpoint");
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

    /**
     * Add new file
     * 
     * @param {string} path 
     * @param {*} data 
     * @param {CreateOptions} [options={}] 
     * @returns {Promise<FileInfo>} 
     * 
     * @memberOf TorstenClient
     */
    create(path: string, data: any, options: CreateOptions = {}): Promise<FileInfo> {
        this._check_token();
        
        if (data == null) return Promise.reject<FileInfo>(createError(ErrorCode.NullData, "no data"))

        let req: request.TorstenRequest = extend({}, options, {
            token: this.token,
            data: data
        });

        if (options.mode) {
            (req.params = req.params || {}).mode = options.mode;
        }

        if (options.meta) {
            (req.params = req.params || {}).meta = JSON.stringify(options.meta);
        }

        path = slugify(path);

        return request.request(HttpMethod.POST, this._toUrl(path), req)
            .then(getResponse)
            .then(res => res.json<IMessage>())
            .then(json => {
                if (json.message != constants.MessageOK) {
                    throw createError(ErrorCode.Unknown, "invalid response: " + json.message);
                }
                return new FileInfo(json.data);
            })
    }

    /**
     * Stat returns the file info from path
     * 
     * @param {string} path 
     * @param {GetOptions} [options={}] 
     * @returns {Promise<FileInfo>} 
     * 
     * @memberOf TorstenClient
     */
    stat(path: string, options: GetOptions = {}): Promise<FileInfo> {
        this._check_token();

        let url = this._toUrl(path);
        return request.request(HttpMethod.GET, url, {
            progress: options.progress,
            params: { stat: true },
            token: this._token
        }).then(getResponse).then(res => {
            return res.json<{ data: IFileInfo }>();
        }).then(i => new FileInfo(i.data))

    }

    /**
     * StatById return the file info from id
     * 
     * @param {string} id 
     * @param {GetOptions} [options={}] 
     * @returns {Promise<FileInfo>} 
     * 
     * @memberOf TorstenClient
     */
    statById(id: string, options: GetOptions = {}): Promise<FileInfo> {
        this._check_token();

        return request.request(HttpMethod.GET, this._toUrl('/'), {
            progress: options.progress,
            params: { stat: true, id: id },
            token: this._token
        }).then(getResponse).then(res => {
            return res.json<{ data: IFileInfo }>();
        }).then(i => new FileInfo(i.data))
    }

    list(path: string, options: ListOptions = {}): Promise<FileInfo[]> {
        this._check_token();

        var req = request.request(HttpMethod.GET, this._toUrl(path), extend({}, options, {
            token: this._token
        }))

        return req.then(getResponse).then(res => res.json<IMessage>()).then(infos => {
            if (infos.message != 'ok') return [];
            return infos.data.map(i => new FileInfo(i));
        })
    }

    /**
     * Open opens a file for reading. 
     * When running on node a ReadableStream will be returned
     * A blob when running in the browser
     * 
     * @param {(string | FileInfo)} path 
     * @param {OpenOptions} [options={}] 
     * @returns {Promise<any>} 
     * 
     * @memberOf TorstenClient
     */
    open(path: string | FileInfo, options: OpenOptions = {}): Promise<any> {
        this._check_token();

        let r: request.TorstenRequest = {
            progress: options.progress,
            token: this.token
        };
        if (options.thumbnail) {
            r.params = r.params || {};
            r.params.thumbnail = true;
        }

        let p: string;
        if (path instanceof FileInfo) {
            p = path.fullPath;
        } else {
            p = path;
        }

        return request.request(HttpMethod.GET, this._toUrl(p), r)
            .then(r => isNode ? r.stream() : r.blob())
    }

    /**
     * Remove a file at path
     * 
     * @param {string} path 
     * @returns {Promise<TorstenResponse>} 
     * 
     * @memberOf TorstenClient
     */
    remove(path: string): Promise<TorstenResponse> {
        this._check_token();
        let url = this._toUrl(path)
        return request.request(HttpMethod.DELETE, url, {
            token: this.token
        }).then(getResponse)
            .then(res => res.json<TorstenResponse>())
    }


    private _toUrl(path: string) {
        if (path == null) {
            throw new Error('no path');
        }
        if (path.substr(0, 1) != "/") {
            path = "/" + path;
        }
        path = "/v1" + path;
        return this._options.endpoint + path;
    }

    private _check_token() {
        if (!this.token) throw createError(0, "no token");
    }

}


function getResponse(res: Response): Promise<Response> {

    if (!res.isValid) {

        switch (res.status) {
            case ErrorCode.NotFound:
                return Promise.reject<Response>(createError(ErrorCode.NotFound, "Not Found"));
            case ErrorCode.AlreadyExists:
                return Promise.reject<Response>(createError(ErrorCode.AlreadyExists, "Already Exists"));
            case ErrorCode.Unauthorized:
                return Promise.reject<Response>(createError(ErrorCode.Unauthorized, "Unauthorized"));
        }

        if (/text\/plain/.test(res.headers.get('Content-Type'))) {
            return res.text().then<any>(t => {
                return Promise.reject<Response>(createError(ErrorCode.Unknown, t));
            }) as Promise<Response>
        } else if (/application\/json/.test(res.headers.get('Content-Type'))) {

            return res.json().then(json => {
                return Promise.reject<Response>(new TorstenJSONError(ErrorCode.Unknown, "Unknown JSON Response", json));
            }) as Promise<Response>;
        }
    }

    return Promise.resolve(res);
}
