"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isISyncanoContext(o) {
    return 'args' in o && 'meta' in o && 'config' in o;
}
