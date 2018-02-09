import { ISyncanoContext } from './types/imiddleware';
import { IMiddlewarePayload } from './types/middleware';
import { IPluginOptions } from './types/options';
export { IPluginInterface, IPostPluginInterface, IPrePluginInterface, PluginProcessFnType } from './types/middleware_plugin';
export declare type RunnerFunction = (ctx: ISyncanoContext, syncano: object, result: object) => object;
declare function executeMiddleware(fn: RunnerFunction, middleware: IMiddlewarePayload, opts?: IPluginOptions): (ctx: ISyncanoContext) => any;
export default executeMiddleware;
