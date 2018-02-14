import { IResponse, IResponsePayload, IResponseStatus } from './types/response';
export { IResponse, IResponsePayload, IResponseStatus } from './types/response';
export interface ISyncanoRequestArgs {
    [s: string]: any;
}
export interface ISyncanoRequestConfig {
    [s: string]: any;
}
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
export interface ISyncanoContext {
    args: ISyncanoRequestArgs;
    meta: ISyncanoRequestMeta;
    config: ISyncanoRequestConfig;
}
export declare type HandlerFn = (ctx: ISyncanoContext, syncano: object) => Promise<IResponse | IResponsePayload | IResponseStatus>;
declare function serve(ctx: ISyncanoContext, handler: HandlerFn): Promise<object>;
export default serve;
