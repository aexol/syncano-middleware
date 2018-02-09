export interface IResultPayload {
    data: object;
}
export interface IResult extends IResultPayload {
    merge(newResult: IResult): IResult;
}
export declare function isIResult(o: object): o is IResult;
export declare function createResult(ires?: IResultPayload): IResult;
