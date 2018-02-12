import Syncano from '@syncano/core';
import * as errors from './errors/errors';
import {IResponse ,isIResponse, isIResponsePayload, isIResponseStatus} from './types/response';
export {IResponse} from './types/response';

export interface ISyncanoContext {
  args: object;
  meta: object;
  config: object;
}

function isISyncanoContext(o: object): o is ISyncanoContext {
  return 'args' in o && 'meta' in o && 'config' in o;
}

class Response implements IResponse {
  constructor(public payload: object = {}, public status: number = 200) {}
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

export type IHandler = (ctx: ISyncanoContext, syncano: object) => Promise<IResponse>;

function serve(ctx: ISyncanoContext, handler: IHandler): Promise<object> {
  const syncano = new Syncano(ctx);
  return handler(ctx, syncano)
      .catch(handleErrors)
      .then(wrapResponse)
      .then(r => syncano.response.json(r.payload, r.status));
}

export default serve;
