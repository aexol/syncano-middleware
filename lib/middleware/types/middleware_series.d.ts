import { BaseArrayMiddleware, IMiddleware } from './imiddleware';
import { IOptions } from './options';
import { IResult } from './result';
export declare class MiddlewareSeries extends BaseArrayMiddleware {
    series: IMiddleware[];
    constructor(series?: IMiddleware[]);
    run(v: object, opts: IOptions): Promise<IResult>;
}
