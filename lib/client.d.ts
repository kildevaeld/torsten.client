import { TorstenClientOptions, CreateOptions, GetOptions, ListOptions, OpenOptions, IFileInfo, IClient, TorstenResponse } from './types';
import { IPromise } from 'orange';
export declare class TorstenClient implements IClient {
    private _options;
    constructor(options: TorstenClientOptions);
    endpoint: string;
    create(path: string, data: any, options?: CreateOptions): IPromise<IFileInfo>;
    stat(path: string, options?: GetOptions): IPromise<IFileInfo>;
    statById(id: string, options?: GetOptions): IPromise<IFileInfo>;
    list(path: string, options?: ListOptions): IPromise<IFileInfo[]>;
    open(path: string, options?: OpenOptions): IPromise<Blob>;
    remove(path: string): IPromise<TorstenResponse>;
    private _toUrl(path);
}
