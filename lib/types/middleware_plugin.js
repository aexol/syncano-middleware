"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
}
Object.defineProperty(exports, "__esModule", { value: true });
const result_1 = require("./result");
function isPrePluginProcessFnType(o) {
    return o instanceof Function;
}
function isIPrePluginInterface(o) {
    return 'preProcess' in o;
}
function isIPostPluginInterface(o) {
    return 'postProcess' in o;
}
class MiddlewarePlugin {
    constructor(plugin) {
        this.plugin = plugin;
    }
    pre(v, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.resolve().then(() => __importStar(require(this.plugin))).then(plugin => {
                const payload = {};
                if (isIPrePluginInterface(plugin)) {
                    return plugin.preProcess(v, opts.pluginOpts[this.plugin]);
                }
                if (isPrePluginProcessFnType(plugin)) {
                    return plugin(v, opts.pluginOpts[this.plugin]);
                }
                return { data: {} };
            }).then(result_1.createResult);
        });
    }
    post(v, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.resolve().then(() => __importStar(require(this.plugin))).then(plugin => {
                const payload = {};
                if (isIPostPluginInterface(plugin)) {
                    return plugin.postProcess(v, opts.pluginOpts[this.plugin]);
                }
                return v;
            });
        });
    }
}
exports.MiddlewarePlugin = MiddlewarePlugin;
