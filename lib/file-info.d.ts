import { IFileInfo } from './types';
export declare class FileInfo implements IFileInfo {
    id: string;
    name: string;
    mime: string;
    size: number;
    ctime: Date;
    mtime: Date;
    mode: number;
    gid: string;
    uid: string;
    meta: any;
    path: string;
    is_dir: boolean;
    hidden: boolean;
    readonly fullPath: string;
    constructor(attr?: any);
    toString(): string;
}
