import {PRE} from './symbols';
export interface IOptions {
  phase: symbol;
  pluginOpts: object;
}

class Options implements IOptions {
  constructor(public pluginOpts: object = {}, public phase: symbol = PRE) {}
}

export function createOptions(pluginOpts: object = {}): IOptions {
  return new Options(pluginOpts);
}
