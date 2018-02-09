import {IResponse} from '../types/response';
export class PreprocessingError extends Error implements IResponse {
  public payload: object;
  public status: number;
  constructor(details: object) {
    super('preprocessing error');
    this.payload = {
      details,
      message: 'could not process this request',
    };
    this.status = 400;
  }
  public merge(newResponse: IResponse): IResponse {
    // Do not merge this with anything1
    return this;
  }
}
