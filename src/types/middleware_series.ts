import {IMiddleware, ISyncanoContext} from './imiddleware';
import {IOptions} from './options';
import { IResponse } from './response';
import {createResult, IResult} from './result';
import {POST, PRE} from './symbols';

export class MiddlewareSeries implements IMiddleware {
  constructor(public series: IMiddleware[] = []) {
  }
  public async pre(v: ISyncanoContext, opts: IOptions): Promise<IResult> {
    return this.series.reduce(
      (acc: Promise<IResult>, val: IMiddleware) =>
        acc.then(state => val.pre(v, opts)
            .then(res => state.merge(res)),
        ),
      Promise.resolve(createResult()),
    );
  }
  public async post(v: IResponse, opts: IOptions): Promise<IResponse> {
    // Should serial postprocessing also merge results?
    return this.series.reduce(
      (acc: Promise<IResponse>, val: IMiddleware) =>
        acc.then(state => val.post(state, opts)),
      Promise.resolve(v),
    );
  }
}
