import { TorstenClientOptions, CreateOptions, GetOptions, ListOptions, OpenOptions, IClient, TorstenResponse } from './types';
import { FileInfo } from './file-info';
export declare class TorstenClient implements IClient {
    private _options;
    constructor(options: TorstenClientOptions);
    private _token;
    token: string;
    readonly endpoint: string;
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
    create(path: string, data: any, options?: CreateOptions): Promise<FileInfo>;
    /**
     * Stat returns the file info from path
     *
     * @param {string} path
     * @param {GetOptions} [options={}]
     * @returns {Promise<FileInfo>}
     *
     * @memberOf TorstenClient
     */
    stat(path: string, options?: GetOptions): Promise<FileInfo>;
    /**
     * StatById return the file info from id
     *
     * @param {string} id
     * @param {GetOptions} [options={}]
     * @returns {Promise<FileInfo>}
     *
     * @memberOf TorstenClient
     */
    statById(id: string, options?: GetOptions): Promise<FileInfo>;
    list(path: string, options?: ListOptions): Promise<FileInfo[]>;
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
    open(path: string | FileInfo, options?: OpenOptions): Promise<any>;
    /**
     * Remove a file at path
     *
     * @param {string} path
     * @returns {Promise<TorstenResponse>}
     *
     * @memberOf TorstenClient
     */
    remove(path: string): Promise<TorstenResponse>;
    private _toUrl(path);
    private _check_token();
}
