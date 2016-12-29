import { TorstenClientOptions, CreateOptions, GetOptions, ListOptions, OpenOptions, IClient, TorstenResponse } from './types';
import { FileInfo } from './file-info';
export declare class TorstenClient implements IClient {
    private _options;
    constructor(options: TorstenClientOptions);
    private _token;
    token: string;
    readonly endpoint: string;
    create(path: string, data: any, options?: CreateOptions): Promise<FileInfo>;
    stat(path: string, options?: GetOptions): Promise<FileInfo>;
    statById(id: string, options?: GetOptions): Promise<FileInfo>;
    list(path: string, options?: ListOptions): Promise<FileInfo[]>;
    open(path: string | FileInfo, options?: OpenOptions): Promise<any>;
    remove(path: string): Promise<TorstenResponse>;
    private _toUrl(path);
    private _check_token();
}
