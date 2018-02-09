import merge from 'lodash.merge';

export interface IResultPayload  {
  data: object;
}

export interface IResult extends IResultPayload {
  merge(newResult: IResult): IResult;
}

class Result {
  public data: object;
  constructor(ires: IResultPayload) {
    this.data = ires.data || {};
  }
  public merge(newResult: IResult): IResult {
    return new Result({
      data: merge({}, this.data, newResult.data),
    });
  }
}

export function createResult(ires: IResultPayload = {data: {}}): IResult {
  return new Result(ires);
}
