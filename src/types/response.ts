import {Headers} from '@syncano/core';
export interface IResponsePayload {
  payload: object;
}

export function isIResponsePayload(o: object): o is IResponsePayload {
  return 'payload' in o;
}

export interface IResponseStatus {
  status: number;
}

export function isIResponseStatus(o: object): o is IResponseStatus {
  return 'status' in o;
}

export interface IResponse extends IResponsePayload, IResponseStatus {
  mimetype?: string;
  headers?: Headers;
}

export function isIResponse(o: object): o is IResponse {
  return isIResponsePayload(o) && isIResponseStatus(o);
}
