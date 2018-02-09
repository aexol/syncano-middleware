import {PRE} from './symbols';

export interface IPluginOptions {
  [s: string]: object;
}

export interface IOptions {
  phase: symbol;
  pluginOpts: IPluginOptions;
}

class Options implements IOptions {
  constructor(public pluginOpts: IPluginOptions = {}, public phase: symbol = PRE) {}
}

export function createOptions(pluginOpts: IPluginOptions = {}): IOptions {
  return new Options(pluginOpts);
}
