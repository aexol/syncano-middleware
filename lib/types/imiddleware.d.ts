import { IOptions } from './options';
import { IResponse } from './response';
import { IResult } from './result';
export interface ISyncanoContext {
    args: object;
    meta: object;
    config: object;
}
export interface IMiddleware {
    pre(v: ISyncanoContext, opts: IOptions): Promise<IResult>;
    post(v: IResponse, opts: IOptions): Promise<IResponse>;
}
export declare type IMiddlewarePayload = (string | IMiddlewareSeries | IMiddlewareParallel)[];
export interface IMiddlewareSeries {
    series: IMiddlewarePayload[];
}
export interface IMiddlewareParallel {
    parallel: IMiddlewarePayload[];
}
