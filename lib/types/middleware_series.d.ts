import { IMiddleware, ISyncanoContext } from './imiddleware';
import { IOptions } from './options';
import { IResponse } from './response';
import { IResult } from './result';
export declare class MiddlewareSeries implements IMiddleware {
    series: IMiddleware[];
    constructor(series?: IMiddleware[]);
    pre(v: ISyncanoContext, opts: IOptions): Promise<IResult>;
    post(v: IResponse, opts: IOptions): Promise<IResponse>;
}
