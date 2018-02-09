import { IMiddleware, ISyncanoContext } from './imiddleware';
import { IOptions } from './options';
import { IResult, IResultPayload } from './result';
export declare type PluginProcessFnType = (val: object, pluginOpts: object) => IResultPayload;
export interface IPrePluginInterface {
    preProcess: PluginProcessFnType;
}
export interface IPostPluginInterface {
    postProcess: PluginProcessFnType;
}
export declare class MiddlewarePlugin implements IMiddleware {
    plugin: string;
    constructor(plugin: string);
    pre(v: ISyncanoContext, opts: IOptions): Promise<IResult>;
    post(v: object, opts: IOptions): Promise<IResult>;
}
