import Syncano, {Context, Headers, RequestArgs, RequestConfig, RequestMeta} from '@syncano/core';
import * as errors from './errors/errors';
import {IResponse,
  IResponsePayload,
  IResponseStatus,
  isIResponse,
  isIResponsePayload,
  isIResponseStatus} from './types/response';
export {IResponse, IResponsePayload, IResponseStatus} from './types/response';

export function isRequestArgs(o: object): o is RequestArgs {
  return true;
}

export function isRequestConfig(o: object): o is RequestConfig {
  return true;
}

export function isRequestMeta(o: object): o is RequestMeta {
  return true;
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
  if ('message' in e) {
    return new Response({message: e.message}, 500);
  }
  return new Response({details: e}, 500);
}

function wrapResponse(r: object): IResponse {
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

export type HandlerFn = (ctx: Context, syncano: object) => Promise<IResponse|IResponsePayload|IResponseStatus>;

function serve(ctx: Context, handler: HandlerFn): Promise<object> {
  const syncano = new Syncano(ctx);
  return handler(ctx, syncano)
      .catch(handleErrors)
      .then(wrapResponse)
      .then(r => {
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
      .then(r => syncano.response(r.payload, r.status, r.mimetype, r.headers));
}

export function response( payload: object,
                          status: number = 200,
                          mimetype: string = 'application/json',
                          headers: Headers = {}): IResponse {
  return new Response(payload, status, mimetype, headers);
}
export default serve;
