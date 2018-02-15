import { IResponse, IResponsePayload, IResponseStatus } from './types/response';
export { IResponse, IResponsePayload, IResponseStatus } from './types/response';
export interface ISyncanoRequestArgs {
    [s: string]: any;
}
export declare function isISyncanoRequestArgs(o: object): o is ISyncanoRequestArgs;
export interface ISyncanoRequestConfig {
    [s: string]: any;
}
export declare function isISyncanoRequestConfig(o: object): o is ISyncanoRequestConfig;
export interface ISyncanoRequestMetaRequest {
    [s: string]: string;
}
export interface ISyncanoRequestMetaMetadataParameters {
    [s: string]: object;
}
export interface ISyncanoRequestMetaMetadata {
    description?: string;
    parameters?: ISyncanoRequestMetaMetadataParameters;
}
export interface ISyncanoRequestMeta {
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
export declare function isISyncanoRequestMeta(o: object): o is ISyncanoRequestMeta;
export interface ISyncanoContext {
    args: ISyncanoRequestArgs;
    meta: ISyncanoRequestMeta;
    config: ISyncanoRequestConfig;
}
export declare function isISyncanoContext(o: object): o is ISyncanoContext;
export interface ISyncanoResponse {
    data: object;
    status: number;
}
export declare function isISyncanoResponse(o: object): o is ISyncanoResponse;
export declare type HandlerFn = (ctx: ISyncanoContext, syncano: object) => Promise<IResponse | IResponsePayload | IResponseStatus>;
declare function serve(ctx: ISyncanoContext, handler: HandlerFn): Promise<object>;
export declare function response(payload: object, status?: number, mimetype?: string, headers?: object): IResponse;
export default serve;
