"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PreprocessingError extends Error {
    constructor(details) {
        super('preprocessing error');
        this.payload = {
            details,
            message: 'could not process this request',
        };
        this.status = 400;
    }
    merge(newResponse) {
        // Do not merge this with anything1
        return this;
    }
}
exports.PreprocessingError = PreprocessingError;
