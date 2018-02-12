import { IResponse, IResponsePayload, IResponseStatus } from './types/response';
export { IResponse, IResponsePayload, IResponseStatus } from './types/response';
export interface ISyncanoContext {
    args: object;
    meta: object;
    config: object;
}
export declare type HandlerFn = (ctx: ISyncanoContext, syncano: object) => Promise<IResponse | IResponsePayload | IResponseStatus>;
export interface IHandler {
    handle: HandlerFn;
}
declare function serve(ctx: ISyncanoContext, handler: HandlerFn): Promise<object>;
export default serve;
