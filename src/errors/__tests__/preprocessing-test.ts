declare var describe;
declare var it;

import {PreprocessingError} from '../preprocessing';

describe('PreprocessingError class', () => {
  it('check error response payload', () => {
    expect(new PreprocessingError({a: 1}).payload).toEqual({
      details: {a: 1},
      message: 'could not process this request',
    });
    expect(new PreprocessingError({a: 1}).status).toEqual(400);
  });
});
