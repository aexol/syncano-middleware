import {BaseArrayMiddleware, IMiddleware} from './imiddleware';
import {IOptions} from './options';
import {createResult, IResult} from './result';
import {POST, PRE} from './symbols';

export class MiddlewareSeries extends BaseArrayMiddleware {
  constructor(public series: IMiddleware[] = []) {
    super();
  }
  public async run(v: object, opts: IOptions): Promise<IResult> {
    return this.series.reduce(
      (acc: Promise<IResult>, val: IMiddleware) =>
        acc.then(state => this.runPhaseOnChild(val, v, opts)
            .then(res => state.merge(res)),
        ),
      Promise.resolve(createResult()),
    );
  }
}
