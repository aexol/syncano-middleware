export interface IPluginOptions {
    [s: string]: object;
}
export interface IOptions {
    phase: symbol;
    pluginOpts: IPluginOptions;
}
export declare function createOptions(pluginOpts?: IPluginOptions): IOptions;
