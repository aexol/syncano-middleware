"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = __importDefault(require("@syncano/core"));
const response_1 = require("./types/response");
function isISyncanoRequestArgs(o) {
    return true;
}
exports.isISyncanoRequestArgs = isISyncanoRequestArgs;
function isISyncanoRequestConfig(o) {
    return true;
}
exports.isISyncanoRequestConfig = isISyncanoRequestConfig;
function isISyncanoRequestMeta(o) {
    return 'socket' in o
        && 'request' in o
        && 'instance' in o
        && 'token' in o
        && 'executor' in o
        && 'executed_by' in o
        && 'api_host' in o
        && 'space_host' in o
        && 'metadata' in o;
}
exports.isISyncanoRequestMeta = isISyncanoRequestMeta;
function isISyncanoContext(o) {
    const ctx = o;
    return 'args' in o
        && isISyncanoRequestArgs(ctx.args)
        && 'meta' in o
        && isISyncanoRequestMeta(ctx.meta)
        && 'config' in o
        && isISyncanoRequestConfig(ctx.config);
}
exports.isISyncanoContext = isISyncanoContext;
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
function handleErrors(e) {
    if (response_1.isIResponse(e)) {
        return e;
    }
    if (isISyncanoResponseError(e)) {
        return new Response({ message: e.response.data }, 500);
    }
    if ('message' in e) {
        return new Response({ message: e.message }, 500);
    }
    return new Response({ details: e }, 500);
}
function wrapResponse(r) {
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
        .catch(handleErrors)
        .then(wrapResponse)
        .then(r => r.mimetype === 'application/json' ? Object.assign({}, r, { payload: JSON.stringify(r.payload) }) :
        r)
        .then(r => syncano.response(r.payload, r.status, r.mimetype, r.headers));
}
function response(payload, status = 200, mimetype = 'application/json', headers = {}) {
    return new Response(payload, status, mimetype, headers);
}
exports.response = response;
exports.default = serve;
