import { HttpMethod, Response } from 'orange.request';
import { Request } from './types';
export interface TorstenRequest extends Request {
    token: string;
}
export declare function request(method: HttpMethod, url: string, r: TorstenRequest): Promise<Response>;
