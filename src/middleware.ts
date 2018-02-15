import Syncano from '@syncano/core';
import * as errors from './errors/errors';
import {IResponse,
  IResponsePayload,
  IResponseStatus,
  isIResponse,
  isIResponsePayload,
  isIResponseStatus} from './types/response';
export {IResponse, IResponsePayload, IResponseStatus} from './types/response';

export interface ISyncanoRequestArgs  {
  // Ignore any here on purpose.
  // tslint:disable-next-line
  [s: string]: any;
}

export function isISyncanoRequestArgs(o: object): o is ISyncanoRequestArgs {
  return true;
}

export interface ISyncanoRequestConfig  {
  // Ignore any here on purpose.
  // tslint:disable-next-line
  [s: string]: any;
}

export function isISyncanoRequestConfig(o: object): o is ISyncanoRequestConfig {
  return true;
}

export interface ISyncanoRequestMetaRequest  {
  [s: string]: string;
}

export interface ISyncanoRequestMetaMetadataParameters  {
  [s: string]: object;
}
export interface ISyncanoRequestMetaMetadata  {
  description?: string;
  parameters?: ISyncanoRequestMetaMetadataParameters;
}

export interface ISyncanoRequestMeta  {
  socket: string;
  request: ISyncanoRequestMetaRequest;
  instance: string;
  token: string;
  executor: string;
  executed_by: string;
  api_host: string;
  space_host: string;
  metadata: ISyncanoRequestMetaMetadataParameters;
}

export function isISyncanoRequestMeta(o: object): o is ISyncanoRequestMeta {
  return 'socket' in o
      && 'request' in o
      && 'instance' in o
      && 'token' in o
      && 'executor' in o
      && 'executed_by' in o
      && 'api_host' in o
      && 'space_host' in o
      && 'metadata' in o;
}

export interface ISyncanoContext {
  args: ISyncanoRequestArgs;
  meta: ISyncanoRequestMeta;
  config: ISyncanoRequestConfig;
}

export function isISyncanoContext(o: object): o is ISyncanoContext {
  const ctx = o as ISyncanoContext;
  return 'args' in o
    && isISyncanoRequestArgs(ctx.args)
    && 'meta' in o
    && isISyncanoRequestMeta(ctx.meta)
    && 'config' in o
    && isISyncanoRequestConfig(ctx.config);
}

class Response implements IResponse {
  constructor(public payload: object = {},
              public status: number = 200,
              public mimetype: string = 'application/json',
              public headers: object = {}) {}
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

export type HandlerFn = (ctx: ISyncanoContext, syncano: object) => Promise<IResponse|IResponsePayload|IResponseStatus>;

function serve(ctx: ISyncanoContext, handler: HandlerFn): Promise<object> {
  const syncano = new Syncano(ctx);
  return handler(ctx, syncano)
      .catch(handleErrors)
      .then(wrapResponse)
      .then(r => r.mimetype === 'application/json' ?
        {...r, payload: JSON.stringify(r.payload)} :
        r,
      )
      .then(r => syncano.response(r.payload, r.status, r.mimetype, r.headers));
}

export function response( payload: object,
                          status: number = 200,
                          mimetype: string = 'application/json',
                          headers: object = {}): IResponse {
  return new Response(payload, status, mimetype, headers);
}
export default serve;
