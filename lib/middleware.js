"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = __importDefault(require("@syncano/core"));
const response_1 = require("./types/response");
function isISyncanoContext(o) {
    return 'args' in o && 'meta' in o && 'config' in o;
}
class Response {
    constructor(payload = {}, status = 200) {
        this.payload = payload;
        this.status = status;
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
function serve(ctx, handler) {
    const syncano = new core_1.default(ctx);
    return handler(ctx, syncano)
        .catch(handleErrors)
        .then(wrapResponse)
        .then(r => syncano.response.json(r.payload, r.status));
}
exports.default = serve;
