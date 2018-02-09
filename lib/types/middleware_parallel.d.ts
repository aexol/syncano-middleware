import { IMiddleware, ISyncanoContext } from './imiddleware';
import { IOptions } from './options';
import { IResponse } from './response';
import { IResult } from './result';
export declare class MiddlewareParallel implements IMiddleware {
    parallel: IMiddleware[];
    constructor(parallel?: IMiddleware[]);
    pre(v: ISyncanoContext, opts: IOptions): Promise<IResult>;
    post(v: IResponse, opts: IOptions): Promise<IResponse>;
}
