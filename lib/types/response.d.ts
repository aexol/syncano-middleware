export interface IResponsePayload {
    payload: object;
}
export declare function isIResponsePayload(o: object): o is IResponsePayload;
export interface IResponseStatus {
    status: number;
}
export declare function isIResponseStatus(o: object): o is IResponseStatus;
export interface IResponse extends IResponsePayload, IResponseStatus {
    mimetype?: string;
    headers?: object;
}
export declare function isIResponse(o: object): o is IResponse;
