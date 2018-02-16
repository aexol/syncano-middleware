import { Headers } from '@syncano/core';
export interface IResponsePayload {
    payload: object;
}
export declare function isIResponsePayload(o: object): o is IResponsePayload;
export interface IResponseStatus {
    status: number;
}
export declare function isIResponseStatus(o: object): o is IResponseStatus;
export interface IResponse extends IResponsePayload, IResponseStatus {
    mimetype?: string;
    headers?: Headers;
}
export declare function isIResponse(o: object): o is IResponse;
export declare class NamedResponse {
    responseName: string;
    content: object;
    constructor(responseName: string, content: object);
}
