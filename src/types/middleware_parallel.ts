import {IMiddleware, ISyncanoContext} from './imiddleware';
import {IOptions} from './options';
import {IResponse} from './response';
import {IResult} from './result';
import {POST, PRE} from './symbols';

export class MiddlewareParallel implements IMiddleware {
  constructor(public parallel: IMiddleware[] = []) {
  }
  public async pre(v: ISyncanoContext, opts: IOptions): Promise<IResult> {
    return Promise.all(this.parallel.map(p => p.pre(v, opts)))
      .then(values =>
        values.reduce((acc: IResult, val: IResult) => acc.merge(val)),
      );
  }
  public async post(v: IResponse, opts: IOptions): Promise<IResponse> {
    return Promise.all(this.parallel.map(p => p.post(v, opts)))
      .then(values =>
        values.reduce((acc: IResponse, val: IResponse) => acc.merge(val)),
      );
  }
}
