"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const symbols_1 = require("./symbols");
class Options {
    constructor(pluginOpts = {}, phase = symbols_1.PRE) {
        this.pluginOpts = pluginOpts;
        this.phase = phase;
    }
}
function createOptions(pluginOpts = {}) {
    return new Options(pluginOpts);
}
exports.createOptions = createOptions;
