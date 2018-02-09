"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const symbols_1 = require("./symbols");
class BaseArrayMiddleware {
    constructor() {
        this.phase = symbols_1.PRE;
    }
    pre(v, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            this.phase = symbols_1.PRE;
            return this.run(v, opts);
        });
    }
    post(v, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            this.phase = symbols_1.POST;
            return this.run(v, opts);
        });
    }
    runPhaseOnChild(child, v, opts) {
        return this.phase === symbols_1.PRE ? child.pre(v, opts) : child.post(v, opts);
    }
}
exports.BaseArrayMiddleware = BaseArrayMiddleware;
