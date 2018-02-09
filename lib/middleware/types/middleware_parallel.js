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
const imiddleware_1 = require("./imiddleware");
class MiddlewareParallel extends imiddleware_1.BaseArrayMiddleware {
    constructor(parallel = []) {
        super();
        this.parallel = parallel;
    }
    run(v, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.all(this.parallel.map(p => this.runPhaseOnChild(p, v, opts)))
                .then(values => values.reduce((acc, val) => acc.merge(val)));
        });
    }
}
exports.MiddlewareParallel = MiddlewareParallel;
