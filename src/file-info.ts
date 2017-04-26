
import { IFileInfo } from './types';
import { has, pick } from 'orange';

const props = ['name', 'mime', 'size', 'ctime', 'mtime', 'mode',
    'gid', 'uid', 'meta', 'path', 'is_dir', 'hidden', 'id'];

export class FileInfo implements IFileInfo {
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

    get fullPath() {
        if (!this.path) return this.name;
        return this.path + (this.path[this.path.length-1] === '/' ? '' : '/') + this.name
    }

    constructor(attr: any = {}) {

        props.forEach(m => {
            if (has(attr, m)) {
                this[m] = attr[m];
            } else {
                if (m == 'meta') {
                    this.meta = {};
                } else {
                    throw new Error(`property: ${m} does not exists`);
                }
            }
        });

        if (!(this.ctime instanceof Date)) {
            this.ctime = new Date(<any>this.ctime);
        }

        if (!(this.mtime instanceof Date)) {
            this.mtime = new Date(<any>this.mtime);
        }
    }

    toString() {
        return `FileInfo(name=${this.name}, mime=${this.mime}, size=${this.size})`;
    }

    toJSON() {
        return pick(this, props);
    }

}
