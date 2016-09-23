import { HttpMethod, Response } from 'orange.request';
import { IPromise } from 'orange';
import { Request } from './types';
export interface TorstenRequest extends Request {
    token: string;
}
export declare function request(method: HttpMethod, url: string, r: TorstenRequest): IPromise<Response>;
export declare function upload(url: string, r: Request, data: any): IPromise<Response>;
