import {IMiddleware} from './imiddleware';
import {IOptions} from './options';
import {IResult} from './result';

export class MiddlewareParallel implements IMiddleware {
  constructor(public parallel: IMiddleware[] = []) {}
  public async run(v: object, opts: IOptions): Promise<IResult> {
    return Promise.all(this.parallel.map(p => p.run(v, opts)))
      .then(values =>
        values.reduce((acc: Result, val: Result) => acc.merge(val)),
      )
      .then(res => res.assert());
  }
}
