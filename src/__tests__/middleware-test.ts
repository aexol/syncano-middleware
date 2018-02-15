declare var describe;
declare var it;

import {IResponse,
  IResponsePayload,
  IResponseStatus,
  isISyncanoContext,
  isISyncanoRequestArgs,
  isISyncanoResponse,
  ISyncanoContext,
  response } from '../middleware';
import serve from '../middleware';

describe('Middleware module', () => {
  it('check isISyncanoRequestArgs assertion', () => {
    expect(isISyncanoRequestArgs({
      a: 1,
      b: 2,
    })).toBe(true);
  });
  it('check isISyncanoContext assertion', () => {
    expect(isISyncanoContext({
      args: {},
      config: {},
      meta: {
        api_host: 'api_host',
        executed_by: 'executed_by',
        executor: 'executor',
        instance: 'instance',
        metadata: {},
        request: {},
        socket: 'sock',
        space_host: 'space_host',
        token: 'token',
      },
    })).toBe(true);
  });
  it('check isISyncanoResponse assertion', () => {
    expect(isISyncanoResponse({
      data: {},
      status: 1,
    })).toBe(true);
  });
  it('serve', () => {
    serve({
      args: {},
      config: {},
      meta: {
        api_host: 'api_host',
        executed_by: 'executed_by',
        executor: 'executor',
        instance: 'instance',
        metadata: {},
        request: {},
        socket: 'sock',
        space_host: 'space_host',
        token: 'token',
      },
    }, async (ctx: ISyncanoContext, syncano: object): Promise<IResponse|IResponsePayload|IResponseStatus> => {
      return {status: 1000};
    })
      .then(v => expect(v)
      .toEqual(
        {
          _content: '{}',
          _headers: {},
          _mimetype: 'application/json',
          _status: 1000,
        },
      ),
    );
    serve({
      args: {},
      config: {},
      meta: {
        api_host: 'api_host',
        executed_by: 'executed_by',
        executor: 'executor',
        instance: 'instance',
        metadata: {},
        request: {},
        socket: 'sock',
        space_host: 'space_host',
        token: 'token',
      },
    }, async (ctx: ISyncanoContext, syncano: object): Promise<IResponse|IResponsePayload|IResponseStatus> => {
      return {payload: {a: 1}};
    })
      .then(v => expect(v)
      .toEqual(
        {
          _content: '{"a":1}',
          _headers: {},
          _mimetype: 'application/json',
          _status: 200,
        },
      ),
    );
    serve({
      args: {},
      config: {},
      meta: {
        api_host: 'api_host',
        executed_by: 'executed_by',
        executor: 'executor',
        instance: 'instance',
        metadata: {},
        request: {},
        socket: 'sock',
        space_host: 'space_host',
        token: 'token',
      },
    }, async (ctx: ISyncanoContext, syncano: object): Promise<IResponse|IResponsePayload|IResponseStatus> => {
      return response({a: 1});
    })
      .then(v => expect(v)
      .toEqual(
        {
          _content: '{"a":1}',
          _headers: {},
          _mimetype: 'application/json',
          _status: 200,
        },
      ),
    );
  });
});
