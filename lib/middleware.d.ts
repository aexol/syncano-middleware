import { Context, Headers, RequestArgs, RequestConfig, RequestMeta } from '@syncano/core';
import Server from '@syncano/core';
import { IResponse, IResponsePayload, IResponseStatus, NamedResponse } from './types/response';
export { IResponse, IResponsePayload, IResponseStatus, NamedResponse } from './types/response';
export declare function isRequestArgs(o: object): o is RequestArgs;
export declare function isRequestConfig(o: object): o is RequestConfig;
export declare function isRequestMeta(o: object): o is RequestMeta;
export declare function isContext(o: object): o is Context;
export interface ISyncanoResponse {
    data: object;
    status: number;
}
export declare function isISyncanoResponse(o: object): o is ISyncanoResponse;
export declare type HandlerFn = (ctx: Context, syncano: Server) => Promise<IResponse | IResponsePayload | IResponseStatus | NamedResponse>;
declare function serve(ctx: Context, handler: HandlerFn): Promise<object>;
export interface IResponseFactory {
    (payload: object, status?: number, mimetype?: string, headers?: Headers): IResponse;
    [s: string]: (content: object) => NamedResponse;
}
export declare const response: IResponseFactory;
export default serve;
