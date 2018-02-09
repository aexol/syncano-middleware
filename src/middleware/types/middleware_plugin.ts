import {IMiddleware} from './imiddleware';
import {IOptions} from './options';
import {createResult, IResult, IResultPayload} from './result';
import {PRE} from './symbols';

type pluginProcessFnType = (val: object, pluginOpts: object) => IResultPayload;
export class MiddlewarePlugin implements IMiddleware {
  constructor(public plugin: string) {}
  public async run(v: object, opts: IOptions): Promise<IResult> {
    return import(this.plugin)
      .then(plugin => {
        let pluginProcess: pluginProcessFnType = (val, pluginOpts) => ({});
        if (opts.phase === PRE) {
          if (plugin.preProcess) {
            pluginProcess = pluginProcess;
          } else if (typeof plugin === 'function') {
            pluginProcess = plugin;
          }
        } else {
          if (plugin.postProcess) {
            pluginProcess = plugin.postProcess;
          }
        }
        return pluginProcess(v, opts.pluginOpts[this.plugin]);
      }).then(createResult);
  }
}
