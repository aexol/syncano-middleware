import Syncano from '@syncano/core';
import merge from 'lodash.merge';
import {IMiddlewarePayload} from './types/middleware';
import {createOptions} from './types/options';
import {IResult} from './types/result';
import {ERROR, OK} from './types/symbols';

interface IResponsePayload {
  payload: object;
}

function isIResponsePayload(o: object): o is IResponsePayload {
  return 'payload' in o;
}

interface IResponseStatus {
  status: number;
}

function isIResponseStatus(o: object): o is IResponseStatus {
  return 'status' in o;
}

interface IResponse extends IResponsePayload, IResponseStatus {}

function isIResponse(o: object): o is IResponse {
  return isIResponsePayload(o) && isIResponseStatus(o);
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

function finishResponse(r: object): IResponse {
  if (isIResponse(r)) {
    return r;
  }
  if (isIResponsePayload(r)) {
    return {...r, status: 200};
  }
  if (isIResponseStatus(r)) {
    return {...r, payload: {}};
  }
  return new Response({
    payloaD: r,
    status: 200,
  });
}

type runnerFunction = (ctx: object, syncano: object, result: IResult) => object;

function executeMiddleware(fn: runnerFunction , middleware: IMiddlewarePayload, opts: object = {}) {
  return ctx => {
    const syncano = Syncano(ctx);
    return run(ctx, middleware, createOptions(opts))
      .then(assertResultOK)
      .then(ret => merge({args: ctx.args}, ret))
      .then(ret => fn(ctx, syncano, ret))
      .then(ret => run(result, middleware, merge(opts, {_phase: POST})))
      .catch(handleErrors)
      .then(r => finishResponse)
      .then(r => syncano.response.json(r.payload, r.status));
  };
}

executeMiddleware.OK = OK;
executeMiddleware.ERROR = ERROR;

export default executeMiddleware;
