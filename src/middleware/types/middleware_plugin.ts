import {IMiddleware, ISyncanoContext} from './imiddleware';
import {IOptions, IPluginOptions} from './options';
import {createResult, IResult, IResultPayload} from './result';
import {PRE} from './symbols';

type pluginProcessFnType = (val: object, pluginOpts: object) => IResultPayload;

function isPluginProcessFnType(o: object): o is pluginProcessFnType {
  return o instanceof Function;
}

export interface IPrePluginInterface {
  preProcess: pluginProcessFnType;
}

function isIPrePluginInterface(o: object): o is IPrePluginInterface {
  return 'preProcess' in o;
}

export interface IPostPluginInterface {
  postProcess: pluginProcessFnType;
}

function isIPostPluginInterface(o: object): o is IPostPluginInterface {
  return 'postProcess' in o;
}

export class MiddlewarePlugin implements IMiddleware {
  constructor(public plugin: string) {}
  public async pre(v: ISyncanoContext, opts: IOptions): Promise<IResult> {
        return import(this.plugin).then(plugin => {
          const payload = {};
          if (isIPrePluginInterface(plugin)) {
            return plugin.preProcess(v, opts.pluginOpts[this.plugin]);
          }
          if (isPluginProcessFnType(plugin)) {
            return plugin(v, opts.pluginOpts[this.plugin]);
          }
          return undefined;
        }).then(createResult);
  }
  public async post(v: object, opts: IOptions): Promise<IResult> {
        return import(this.plugin).then(plugin => {
          const payload = {};
          if (isIPostPluginInterface(plugin)) {
            return plugin.postProcess(v, opts.pluginOpts[this.plugin]);
          }
          return undefined;
        }).then(createResult);
  }
}
