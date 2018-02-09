import { IOptions } from './options';
import { IResult } from './result';
export interface ISyncanoContext {
    args: object;
    meta: object;
    config: object;
}
export interface IMiddleware {
    pre(v: ISyncanoContext, opts: IOptions): Promise<IResult>;
    post(v: object, opts: IOptions): Promise<IResult>;
}
export declare type IMiddlewarePayload = (string | IMiddlewareSeries | IMiddlewareParallel)[];
export interface IMiddlewareSeries {
    series: IMiddlewarePayload[];
}
export interface IMiddlewareParallel {
    parallel: IMiddlewarePayload[];
}
export declare abstract class BaseArrayMiddleware implements IMiddleware {
    private phase;
    constructor();
    pre(v: ISyncanoContext, opts: IOptions): Promise<IResult>;
    post(v: object, opts: IOptions): Promise<IResult>;
    protected runPhaseOnChild(child: IMiddleware, v: object, opts: IOptions): Promise<IResult>;
    protected abstract run(v: object, opts: IOptions): Promise<IResult>;
}
