import {IOptions} from './options';
import {IResult} from './result';

export interface IMiddleware {
  run(v: object, opts: IOptions): Promise<IResult>;
}

type IMiddlewarePayload = (string|IMiddlewareSeries|IMiddlewareParallel)[];

export interface IMiddlewareSeries {
  series: IMiddlewarePayload[];
}

export interface IMiddlewareParallel {
  parallel: IMiddlewarePayload[];
}
