"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const middleware_parallel_1 = require("./middleware_parallel");
const middleware_plugin_1 = require("./middleware_plugin");
const middleware_series_1 = require("./middleware_series");
function isIMiddlewareSeries(o) {
    return 'series' in o;
}
function isIMiddlewareParallel(o) {
    return 'parallel' in o;
}
function createMiddleware(o) {
    if (typeof o === 'string') {
        return new middleware_plugin_1.MiddlewarePlugin(o);
    }
    if (isIMiddlewareSeries(o)) {
        return new middleware_series_1.MiddlewareSeries(o.series.map(createMiddleware));
    }
    if (isIMiddlewareParallel(o)) {
        return new middleware_parallel_1.MiddlewareParallel(o.parallel.map(createMiddleware));
    }
    throw new Error('${o} is not a middleware object');
}
exports.createMiddleware = createMiddleware;
