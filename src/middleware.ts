import Syncano from '@syncano/core';
import merge from 'lodash.merge';
import * as errors from './errors/errors';
import {IMiddleware, ISyncanoContext} from './types/imiddleware';
import {createMiddleware, IMiddlewarePayload} from './types/middleware';
import {createOptions, IPluginOptions} from './types/options';
import {IResponse ,isIResponse, isIResponsePayload, isIResponseStatus} from './types/response';
import {createResult, IResult, IResultPayload} from './types/result';
export {IPluginInterface,
  IPostPluginInterface,
  IPrePluginInterface,
  PluginPreProcessFnType,
  PluginPostProcessFnType,
} from './types/middleware_plugin';
export {IResultPayload} from './types/result';

class Response implements IResponse {
  constructor(public payload: object = {}, public status: number = 200) {}
  public merge(newResponse: IResponse): IResponse {
    return merge(new Response(), this, newResponse);
  }
}

interface ISyncanoResponse {
  data: object;
  status: number;
}
function isISyncanoResponse(o: object): o is ISyncanoResponse {
  return 'data' in o && 'status' in o;
}

interface ISyncanoResponseError {
  response: ISyncanoResponse;
}
function isISyncanoResponseError(o: object): o is ISyncanoResponseError {
  return 'response' in o && isISyncanoResponse((o as ISyncanoResponseError).response);
}

function handleErrors(e: (Error|ISyncanoResponseError|IResponse)): IResponse {
  if (isIResponse(e)) {
    return e;
  }
  if (isISyncanoResponseError(e)) {
    return new Response({message: e.response.data}, 500);
  }
  return new Response({message: e.message}, 500);
}

function wrapResponse(r: object): IResponse {
  if (isIResponse(r)) {
    return r;
  }
  if (isIResponsePayload(r)) {
    return new Response({...r, status: 200});
  }
  if (isIResponseStatus(r)) {
    return new Response({...r, payload: {}});
  }
  return new Response({
    payloaD: r,
    status: 200,
  });
}

export type RunnerFunction = (ctx: ISyncanoContext, syncano: object, result: object) => object;

interface IErrorWithDetails extends Error {
  details: object;
}
function isIErrorWithDetails(o: object): o is IErrorWithDetails {
  return 'details' in o;
}
function handlePreprocessingError(e: (Error|IErrorWithDetails)): IResult {
  if (isIErrorWithDetails(e)) {
    throw new errors.PreprocessingError(e.details);
  }
  throw new errors.PreprocessingError({detailedMessage: e.message});
}

function executeMiddleware(fn: RunnerFunction , middleware: IMiddlewarePayload, opts: IPluginOptions = {}) {
  return (ctx: ISyncanoContext) => {
    const syncano = Syncano(ctx);
    let middlewareObj: IMiddleware;
    try  {
      middlewareObj = createMiddleware(middleware);
    } catch (e) {
      return syncano.response.json({message: e.message}, 500);
    }
    const ropts = createOptions(opts);
    return middlewareObj.pre(ctx, ropts)
      .catch(handlePreprocessingError)
      .then(ret => createResult({data: {args: ctx.args}}).merge(ret))
      .then(ret => fn(ctx, syncano, ret.data))
      .then(wrapResponse)
      .then(ret => middlewareObj.post(ret, ropts))
      .catch(handleErrors)
      .then(wrapResponse)
      .then(r => syncano.response.json(r.payload, r.status));
  };
}

export default executeMiddleware;
