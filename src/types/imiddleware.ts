import {IOptions} from './options';
import {IResponse, isIResponse} from './response';
import {IResult, isIResult} from './result';
import {POST, PRE} from './symbols';

export interface ISyncanoContext {
  args: object;
  meta: object;
  config: object;
}

function isISyncanoContext(o: object): o is ISyncanoContext {
  return 'args' in o && 'meta' in o && 'config' in o;
}

export interface IMiddleware {
  pre(v: ISyncanoContext, opts: IOptions): Promise<IResult>;
  post(v: IResponse, opts: IOptions): Promise<IResponse>;
}

export type IMiddlewarePayload = (string|IMiddlewareSeries|IMiddlewareParallel)[];

export interface IMiddlewareSeries {
  series: IMiddlewarePayload[];
}

export interface IMiddlewareParallel {
  parallel: IMiddlewarePayload[];
}
