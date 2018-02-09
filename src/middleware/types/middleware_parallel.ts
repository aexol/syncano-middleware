import {BaseArrayMiddleware, IMiddleware} from './imiddleware';
import {IOptions} from './options';
import {IResult} from './result';
import {POST, PRE} from './symbols';

export class MiddlewareParallel extends BaseArrayMiddleware {
  constructor(public parallel: IMiddleware[] = []) {
    super();
  }
  protected async run(v: object, opts: IOptions): Promise<IResult> {
    return Promise.all(this.parallel.map(p => this.runPhaseOnChild(p, v, opts)))
      .then(values =>
        values.reduce((acc: IResult, val: IResult) => acc.merge(val)),
      );
  }
}
