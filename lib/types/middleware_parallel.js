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
class MiddlewareParallel {
    constructor(parallel = []) {
        this.parallel = parallel;
    }
    pre(v, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.all(this.parallel.map(p => p.pre(v, opts)))
                .then(values => values.reduce((acc, val) => acc.merge(val)));
        });
    }
    post(v, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.all(this.parallel.map(p => p.post(v, opts)))
                .then(values => values.reduce((acc, val) => acc.merge(val)));
        });
    }
}
exports.MiddlewareParallel = MiddlewareParallel;
