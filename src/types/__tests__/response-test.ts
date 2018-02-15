declare var jest;
declare var describe;
declare var it;
declare var expect;

import {
  isIResponse, isIResponsePayload, isIResponseStatus,
} from '../response';

describe('Response modules', () => {
  it('checks isIResponsePaylaod type assertion', () => {
    expect(isIResponsePayload({payload: {}})).toBe(true);
    expect(isIResponsePayload({})).toBe(false);
  });
  it('checks isIResponseStatus type assertion', () => {
    expect(isIResponseStatus({status: {}})).toBe(true);
    expect(isIResponseStatus({})).toBe(false);
  });
  it('checks isIResponse type assertion', () => {
    expect(isIResponse({payload: {}, status: {}})).toBe(true);
    expect(isIResponse({payload: {}})).toBe(false);
    expect(isIResponse({status: {}})).toBe(false);
    expect(isIResponse({})).toBe(false);
  });
});
