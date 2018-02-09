import {IOptions} from './options';
import {IResult} from './result';
import {POST, PRE} from './symbols';

export interface ISyncanoContext {
  args: object;
  meta: object;
  config: object;
}

export interface IMiddleware {
  pre(v: ISyncanoContext, opts: IOptions): Promise<IResult>;
  post(v: object, opts: IOptions): Promise<IResult>;
}

export type IMiddlewarePayload = (string|IMiddlewareSeries|IMiddlewareParallel)[];

export interface IMiddlewareSeries {
  series: IMiddlewarePayload[];
}

export interface IMiddlewareParallel {
  parallel: IMiddlewarePayload[];
}

export abstract class BaseArrayMiddleware implements IMiddleware {
  private phase: symbol;
  constructor() {
    this.phase = PRE;
  }
  public async pre(v: ISyncanoContext, opts: IOptions): Promise<IResult> {
    this.phase = PRE;
    return this.run(v, opts);
  }
  public async post(v: object, opts: IOptions): Promise<IResult> {
    this.phase = POST;
    return this.run(v, opts);
  }
  protected runPhaseOnChild(child: IMiddleware, v: object, opts: IOptions): Promise<IResult> {
    return this.phase === PRE ? child.pre(v as ISyncanoContext, opts) : child.post(v, opts);
  }
  protected abstract run(v: object, opts: IOptions): Promise<IResult>;
}
