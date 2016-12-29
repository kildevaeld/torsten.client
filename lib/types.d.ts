export declare enum FileMode {
    UserRead = 256,
    UserWrite = 128,
    UserDelete = 64,
    GroupRead = 32,
    GroupWrite = 16,
    GroupDelete = 8,
    OtherRead = 4,
    OtherWriter = 2,
    OtherDelete = 0,
}
export interface TorstenResponse {
    message: string;
    data?: any;
}
export declare namespace constants {
    const MessageOK = "ok";
}
export interface IClient {
    endpoint: string;
    token: string;
    create(path: string, data: any, options: CreateOptions): Promise<IFileInfo>;
    open(path: string, options: OpenOptions): Promise<Blob>;
    stat(path: string, options?: GetOptions): Promise<IFileInfo>;
    list(path: string, options?: ListOptions): Promise<IFileInfo[]>;
    remove(path: string, options?: RemoveOptions): Promise<TorstenResponse>;
}
export interface Request {
    mime?: string;
    headers?: any;
    params?: any;
    data?: any;
    size?: number;
    progress?: (e: ProgressEvent) => void;
}
export interface IFileInfo {
    id: string;
    name: string;
    path: string;
    mime: string;
    size: number;
    ctime: Date;
    mtime: Date;
    mode: number;
    gid: string;
    uid: string;
    meta: any;
}
export interface CreateOptions {
    mime?: string;
    size?: number;
    mode?: FileMode;
    meta?: any;
    progress?: (e: ProgressEvent) => void;
}
export interface GetOptions {
    progress?: (e: ProgressEvent) => void;
}
export interface OpenOptions extends GetOptions {
    stream?: boolean;
    thumbnail?: boolean;
}
export interface ListOptions {
    page?: number;
    limit?: number;
    progress?: (e: ProgressEvent) => void;
    raw?: boolean;
}
export interface RemoveOptions {
}
export interface TorstenClientOptions {
    endpoint: string;
    token?: string;
}
