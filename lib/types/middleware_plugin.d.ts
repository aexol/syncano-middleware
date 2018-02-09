import { IMiddleware, ISyncanoContext } from './imiddleware';
import { IOptions } from './options';
import { IResponse } from './response';
import { IResult, IResultPayload } from './result';
export declare type PluginPreProcessFnType = (val: ISyncanoContext, pluginOpts: object) => (IResultPayload | Promise<IResultPayload>);
export declare type PluginPostProcessFnType = (val: IResponse, pluginOpts: object) => (IResponse | Promise<IResponse>);
export interface IPrePluginInterface {
    preProcess: PluginPreProcessFnType;
}
export interface IPostPluginInterface {
    postProcess: PluginPostProcessFnType;
}
export interface IPluginInterface extends IPrePluginInterface, IPostPluginInterface {
}
export declare class MiddlewarePlugin implements IMiddleware {
    plugin: string;
    constructor(plugin: string);
    pre(v: ISyncanoContext, opts: IOptions): Promise<IResult>;
    post(v: IResponse, opts: IOptions): Promise<IResponse>;
}
