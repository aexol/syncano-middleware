export {IMiddleware, IMiddlewarePayload, IMiddlewareParallel, IMiddlewareSeries} from './imiddleware';
import {MiddlewareParallel} from './middleware_Parallel';
import {MiddlewarePlugin} from './middleware_plugin';
import {MiddlewareSeries} from './middleware_series';

function isIMiddlewareSeries(o: object): o is IMiddlewareSeries {
  return 'series' in o;
}

function isIMiddlewareParallel(o: object): o is IMiddlewareParallel {
  return 'parallel' in o;
}

export function createMiddleware(o: IMiddlewarePayload): IMiddleware {
  if (typeof o === 'string') {
    return new MiddlewarePlugin(o);
  }
  if (isIMiddlewareSeries(o)) {
    return new MiddlewareSeries(o.series.map(createMiddleware));
  }
  if (isIMiddlewareParallel(o)) {
    return new MiddlewareParallel(o.series.map(createMiddleware));
  }
  throw new Error('${o} is not a middleware object');
}
