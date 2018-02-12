import { IResponse, IResponsePayload, IResponseStatus } from './types/response';
export { IResponse, IResponsePayload, IResponseStatus } from './types/response';
export interface ISyncanoContext {
    args: object;
    meta: object;
    config: object;
}
export declare type IHandler = (ctx: ISyncanoContext, syncano: object) => Promise<IResponse | IResponsePayload | IResponseStatus>;
declare function serve(ctx: ISyncanoContext, handler: IHandler): Promise<object>;
export default serve;
