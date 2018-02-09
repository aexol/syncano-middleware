import {IMiddleware, ISyncanoContext} from './imiddleware';
import {IOptions, IPluginOptions} from './options';
import { IResponse } from './response';
import {createResult, IResult, IResultPayload} from './result';
import {PRE} from './symbols';

export type PluginPreProcessFnType =
  (val: ISyncanoContext, pluginOpts: object) => (IResultPayload|Promise<IResultPayload>);
export type PluginPostProcessFnType =
  (val: IResponse, pluginOpts: object) => (IResponse|Promise<IResponse>);

function isPrePluginProcessFnType(o: object): o is PluginPreProcessFnType {
  return o instanceof Function;
}

export interface IPrePluginInterface {
  preProcess: PluginPreProcessFnType;
}

function isIPrePluginInterface(o: object): o is IPrePluginInterface {
  return 'preProcess' in o;
}

export interface IPostPluginInterface {
  postProcess: PluginPostProcessFnType;
}

function isIPostPluginInterface(o: object): o is IPostPluginInterface {
  return 'postProcess' in o;
}

export interface IPluginInterface extends IPrePluginInterface, IPostPluginInterface {}

export class MiddlewarePlugin implements IMiddleware {
  constructor(public plugin: string) {}
  public async pre(v: ISyncanoContext, opts: IOptions): Promise<IResult> {
        return import(this.plugin).then(plugin => {
          const payload = {};
          if (isIPrePluginInterface(plugin)) {
            return plugin.preProcess(v, opts.pluginOpts[this.plugin]);
          }
          if (isPrePluginProcessFnType(plugin)) {
            return plugin(v, opts.pluginOpts[this.plugin]);
          }
          return {data: {}};
        }).then(createResult);
  }
  public async post(v: IResponse, opts: IOptions): Promise<IResponse> {
        return import(this.plugin).then(plugin => {
          const payload = {};
          if (isIPostPluginInterface(plugin)) {
            return plugin.postProcess(v, opts.pluginOpts[this.plugin]);
          }
          return v;
        });
  }
}
