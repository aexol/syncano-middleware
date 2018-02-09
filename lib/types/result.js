"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_merge_1 = __importDefault(require("lodash.merge"));
function isIResult(o) {
    return 'merge' in o && 'data' in o;
}
exports.isIResult = isIResult;
class Result {
    constructor(ires) {
        this.data = ires.data || {};
    }
    merge(newResult) {
        return new Result({
            data: lodash_merge_1.default({}, this.data, newResult.data),
        });
    }
}
function createResult(ires = { data: {} }) {
    return new Result(ires);
}
exports.createResult = createResult;
