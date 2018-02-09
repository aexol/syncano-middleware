import { IResponse } from '../types/response';
export declare class PreprocessingError extends Error implements IResponse {
    payload: object;
    status: number;
    constructor(details: object);
    merge(newResponse: IResponse): IResponse;
}
