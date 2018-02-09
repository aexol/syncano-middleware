import merge from 'lodash.merge';
import {ERROR, OK} from './symbols';

export interface IResultPayload  {
  data?: object;
  status?: symbol;
}

export interface IResult extends IResultPayload {
  merge(newResult: IResult): IResult;
  assert(): IResult;
}

class Result {
  public data: object;
  public status: symbol;
  constructor(ires: IResultPayload) {
    this.data = ires.data || {};
    this.status = ires.status || OK;
  }
  public merge(newResult: IResult): IResult {
    return new Result({
      data: merge({}, this.data, newResult.data),
      status: this.status === ERROR || newResult.status === ERROR ? ERROR : OK,
    });
  }

  public assert(): IResult {
    if (this.status === ERROR) {
      throw Object.assign(new Error('middleware error'), {
        payload: {
          details: this.data,
          message: 'There was an error while processing your request',
        },
        status: 400,
      });
    }
    return this;
  }
}

export function createResult(ires: IResultPayload): IResult {
  return new Result(ires);
}
