"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = __importDefault(require("@syncano/core"));
const lodash_get_1 = __importDefault(require("lodash.get"));
const response_1 = require("./types/response");
var response_2 = require("./types/response");
exports.NamedResponse = response_2.NamedResponse;
function isRequestArgs(o) {
    return true;
}
exports.isRequestArgs = isRequestArgs;
function isRequestConfig(o) {
    return true;
}
exports.isRequestConfig = isRequestConfig;
function isRequestMeta(o) {
    return true;
}
exports.isRequestMeta = isRequestMeta;
function isNamedResponse(o) {
    return 'responseName' in o && 'content' in o;
}
function isContext(o) {
    const ctx = o;
    return 'args' in o
        && isRequestArgs(ctx.args)
        && 'meta' in o
        && isRequestMeta(ctx.meta)
        && 'config' in o
        && isRequestConfig(ctx.config);
}
exports.isContext = isContext;
class Response {
    constructor(payload = {}, status = 200, mimetype = 'application/json', headers = {}) {
        this.payload = payload;
        this.status = status;
        this.mimetype = mimetype;
        this.headers = headers;
    }
}
function isISyncanoResponse(o) {
    return 'data' in o && 'status' in o;
}
exports.isISyncanoResponse = isISyncanoResponse;
function isISyncanoResponseError(o) {
    return 'response' in o && isISyncanoResponse(o.response);
}
function handleErrors(e, ctx, syncano) {
    if (response_1.isIResponse(e)) {
        return e;
    }
    const logger = syncano.logger(lodash_get_1.default(ctx, 'meta.executor', 'unknown'));
    logger.error(e.stack || '<--- no stack info --->');
    logger.error(e.message || '<-- no error message -->');
    if (isISyncanoResponseError(e)) {
        return new Response({ message: e.response.data }, 500);
    }
    if ('message' in e) {
        return new Response({ message: e.message }, 500);
    }
    return new Response({ details: e }, 500);
}
function wrapResponse(r) {
    if (isNamedResponse(r)) {
        return r;
    }
    if (response_1.isIResponse(r)) {
        return r;
    }
    if (response_1.isIResponsePayload(r)) {
        return new Response(r.payload);
    }
    if (response_1.isIResponseStatus(r)) {
        return new Response({}, r.status);
    }
    return new Response(r, 200);
}
function serve(ctx, handler) {
    const syncano = new core_1.default(ctx);
    return handler(ctx, syncano)
        .catch(e => handleErrors(e, ctx, syncano))
        .then(wrapResponse)
        .then(r => {
        if (isNamedResponse(r)) {
            return r;
        }
        const mimetype = r.mimetype || 'application/json';
        const isJson = r.mimetype === 'application/json';
        const headers = r.headers || {};
        return Object.assign({}, r, { headers,
            mimetype, payload: isJson ? JSON.stringify(r.payload) : r.payload });
    })
        .then(r => isNamedResponse(r) ?
        // tslint:disable-next-line
        syncano.response[r.responseName](r.content) :
        syncano.response(r.payload, r.status, r.mimetype, r.headers));
}
exports.response = (() => {
    // tslint:disable-next-line
    const fn = (payload, status = 200, mimetype = 'application/json', headers = {}) => {
        return new Response(payload, status, mimetype, headers);
    };
    fn.get = (target, name) => {
        return (content) => new response_1.NamedResponse(name, content);
    };
    // tslint:disable-next-line
    fn.apply = (target, thisArg, args) => {
        return target(args[0], args[1], args[2], args[3]);
    };
    const respHandler = fn;
    return new Proxy(fn, respHandler);
})();
exports.default = serve;
