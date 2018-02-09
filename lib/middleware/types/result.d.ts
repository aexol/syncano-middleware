export interface IResultPayload {
    data: object;
}
export interface IResult extends IResultPayload {
    merge(newResult: IResult): IResult;
}
export declare function createResult(ires?: IResultPayload): IResult;
