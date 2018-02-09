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
const result_1 = require("./result");
class MiddlewareSeries {
    constructor(series = []) {
        this.series = series;
    }
    pre(v, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.series.reduce((acc, val) => acc.then(state => val.pre(v, opts)
                .then(res => state.merge(res))), Promise.resolve(result_1.createResult()));
        });
    }
    post(v, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            // Should serial postprocessing also merge results?
            return this.series.reduce((acc, val) => acc.then(state => val.post(state, opts)), Promise.resolve(v));
        });
    }
}
exports.MiddlewareSeries = MiddlewareSeries;
