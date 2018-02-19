import Syncano, {Context, Headers, RequestArgs, RequestConfig, RequestMeta} from '@syncano/core';
import Server from '@syncano/core';
import get from 'lodash.get';
import * as errors from './errors/errors';
import {IResponse,
  IResponsePayload,
  IResponseStatus,
  isIResponse,
  isIResponsePayload,
  isIResponseStatus,
  NamedResponse} from './types/response';
export {IResponse,
  IResponsePayload,
  IResponseStatus,
  NamedResponse} from './types/response';

export function isRequestArgs(o: object): o is RequestArgs {
  return true;
}

export function isRequestConfig(o: object): o is RequestConfig {
  return true;
}

export function isRequestMeta(o: object): o is RequestMeta {
  return true;
}

function isNamedResponse(o: object): o is NamedResponse {
  return 'responseName' in o && 'content' in o;
}

export function isContext(o: object): o is Context {
  const ctx = o as Context;
  return 'args' in o
    && isRequestArgs(ctx.args as RequestArgs)
    && 'meta' in o
    && isRequestMeta(ctx.meta as RequestMeta)
    && 'config' in o
    && isRequestConfig(ctx.config as RequestConfig);
}

class Response implements IResponse {
  constructor(public payload: object = {},
              public status: number = 200,
              public mimetype: string = 'application/json',
              public headers: Headers = {}) {}
}

export interface ISyncanoResponse {
  data: object;
  status: number;
}
export function isISyncanoResponse(o: object): o is ISyncanoResponse {
  return 'data' in o && 'status' in o;
}

interface ISyncanoResponseError extends Error {
  response: ISyncanoResponse;
}
function isISyncanoResponseError(o: object): o is ISyncanoResponseError {
  return 'response' in o && isISyncanoResponse((o as ISyncanoResponseError).response);
}

function handleErrors(e: (Error|ISyncanoResponseError|IResponse),
                      ctx: Context,
                      syncano: Server): IResponse {
  if (isIResponse(e)) {
    return e;
  }
  const logger = syncano.logger(get(ctx, 'meta.executor', 'unknown'));
  logger.error(e.stack || '<--- no stack info --->');
  logger.error(e.message || '<-- no error message -->');
  if (isISyncanoResponseError(e)) {
    return new Response({message: e.response.data}, 500);
  }
  if ('message' in e) {
    return new Response({message: e.message}, 500);
  }
  return new Response({details: e}, 500);
}

function wrapResponse(r: object): (IResponse|NamedResponse) {
  if (isNamedResponse(r)) {
    return r;
  }
  if (isIResponse(r)) {
    return r;
  }
  if (isIResponsePayload(r)) {
    return new Response(r.payload);
  }
  if (isIResponseStatus(r)) {
    return new Response({}, r.status);
  }
  return new Response(r, 200);
}

export type HandlerFn = (ctx: Context, syncano: Server)
    => Promise<IResponse|IResponsePayload|IResponseStatus|NamedResponse>;

function serve(ctx: Context, handler: HandlerFn): Promise<object> {
  const syncano = new Syncano(ctx);
  return handler(ctx, syncano)
      .catch(e => handleErrors(e, ctx, syncano))
      .then(wrapResponse)
      .then(r => {
        if (isNamedResponse(r)) {
          return r;
        }
        const mimetype = r.mimetype || 'application/json';
        const isJson = r.mimetype === 'application/json';
        const headers: Headers = r.headers || {};
        return {
          ...r,
          headers,
          mimetype,
          payload: isJson ? JSON.stringify(r.payload) : r.payload,
        };
      },
      )
      .then(r => isNamedResponse(r) ?
        (
          // tslint:disable-next-line
          syncano.response[r.responseName] as (content: any) => any
        )(r.content) :
        syncano.response(r.payload, r.status, r.mimetype, r.headers) );
}

export interface IResponseFactory {
  ( payload: object,
    status?: number,
    mimetype?: string,
    headers?: Headers): IResponse;
  [s: string]: (content: object) => NamedResponse;
}
type defaultResponse = (payload: object,
                        status?: number,
                        mimetype?: string,
                        headers?: Headers) => IResponse;
export const response: IResponseFactory = (() => {
  // tslint:disable-next-line
  const fn: any = ( payload: object,
                    status: number = 200,
                    mimetype: string = 'application/json',
                    headers: Headers = {}): IResponse => {
                      return new Response(payload, status, mimetype, headers);
  };

  fn.get = (target: object, name: string) => {
    return (content: object) => new NamedResponse(name, content);
  };
  // tslint:disable-next-line
  fn.apply = (target: defaultResponse, thisArg: defaultResponse, args: any[]) : any => {
    return target(args[0], args[1], args[2], args[3]);
  };
  const respHandler: ProxyHandler<defaultResponse
  > = fn;
  return new Proxy(fn, respHandler);
})();

export default serve;
