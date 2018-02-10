"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
}
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = __importDefault(require("@syncano/core"));
const lodash_merge_1 = __importDefault(require("lodash.merge"));
const errors = __importStar(require("./errors/errors"));
const middleware_1 = require("./types/middleware");
const options_1 = require("./types/options");
const response_1 = require("./types/response");
const result_1 = require("./types/result");
class Response {
    constructor(payload = {}, status = 200) {
        this.payload = payload;
        this.status = status;
    }
    merge(newResponse) {
        return lodash_merge_1.default(new Response(), this, newResponse);
    }
}
function isISyncanoResponse(o) {
    return 'data' in o && 'status' in o;
}
function isISyncanoResponseError(o) {
    return 'response' in o && isISyncanoResponse(o.response);
}
function handleErrors(e) {
    if (response_1.isIResponse(e)) {
        return e;
    }
    if (isISyncanoResponseError(e)) {
        return new Response({ message: e.response.data }, 500);
    }
    return new Response({ message: e.message }, 500);
}
function wrapResponse(r) {
    if (response_1.isIResponse(r)) {
        return r;
    }
    if (response_1.isIResponsePayload(r)) {
        return new Response(Object.assign({}, r, { status: 200 }));
    }
    if (response_1.isIResponseStatus(r)) {
        return new Response(Object.assign({}, r, { payload: {} }));
    }
    return new Response({
        payloaD: r,
        status: 200,
    });
}
function isIErrorWithDetails(o) {
    return 'details' in o;
}
function handlePreprocessingError(e) {
    if (isIErrorWithDetails(e)) {
        throw new errors.PreprocessingError(e.details);
    }
    throw new errors.PreprocessingError({ detailedMessage: e.message });
}
function executeMiddleware(fn, middleware, opts = {}) {
    return (ctx) => {
        const syncano = new core_1.default(ctx);
        let middlewareObj;
        try {
            middlewareObj = middleware_1.createMiddleware(middleware);
        }
        catch (e) {
            return syncano.response.json({ message: e.message }, 500);
        }
        const ropts = options_1.createOptions(opts);
        return middlewareObj.pre(ctx, ropts)
            .catch(handlePreprocessingError)
            .then(ret => result_1.createResult({ data: { args: ctx.args } }).merge(ret))
            .then(ret => fn(ctx, syncano, ret.data))
            .then(wrapResponse)
            .then(ret => middlewareObj.post(ret, ropts))
            .catch(handleErrors)
            .then(wrapResponse)
            .then(r => syncano.response.json(r.payload, r.status));
    };
}
exports.default = executeMiddleware;
