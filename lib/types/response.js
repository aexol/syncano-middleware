"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isIResponsePayload(o) {
    return 'payload' in o;
}
exports.isIResponsePayload = isIResponsePayload;
function isIResponseStatus(o) {
    return 'status' in o;
}
exports.isIResponseStatus = isIResponseStatus;
function isIResponse(o) {
    return isIResponsePayload(o) && isIResponseStatus(o);
}
exports.isIResponse = isIResponse;
class NamedResponse {
    constructor(responseName, content) {
        this.responseName = responseName;
        this.content = content;
    }
}
exports.NamedResponse = NamedResponse;
