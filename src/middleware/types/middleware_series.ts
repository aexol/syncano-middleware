import {IMiddleware} from './imiddleware';
import {IOptions} from './options';
import {IResult} from './result';

export class MiddlewareSeries implements IMiddleware {
  constructor(public series: IMiddleware[] = []) {}
  public async run(v: object, opts: IOptions): Promise<IResult> {
    return this.series.reduce(
      (acc: Promise<Result>, val: IMiddleware) =>
        acc.then(state =>
          val
            .run(v, opts)
            .then(res => state.merge(res))
            .then(ret => ret.assert()),
        ),
      Promise.resolve(new Result({})),
    );
  }
}
