import { BaseArrayMiddleware, IMiddleware } from './imiddleware';
import { IOptions } from './options';
import { IResult } from './result';
export declare class MiddlewareParallel extends BaseArrayMiddleware {
    parallel: IMiddleware[];
    constructor(parallel?: IMiddleware[]);
    protected run(v: object, opts: IOptions): Promise<IResult>;
}
