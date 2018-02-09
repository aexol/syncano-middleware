import merge from 'lodash.merge';

function mergeNewResult(res, newRes) {
  let status = res.status || 200;
  res = merge(res, newRes);
  if (res.status === 200 && status !== 200) {
    res.status = status;
  }
  return res;
}

function mergeNewResults(res, results) {
  return results.reduce((acc, val) => mergeResult(acc, val), Object.assign(res))
}

function runSeries(ctx, series) {
  return run(ctx, series[0])
    .then(res => [
      res,
      res.status === 200 && series[1]
        ? runSeries(ctx, series.slice(1))
        : {}
    ])
    .then(([ret, resp]) => mergeNewResult(ret, resp));
}

function runParallel(ctx, parallel) {
    return Promise.all(parallel.map(p => run(ctx, p))).then(values => mergeNewResults({}, values))
}

function run(ctx, middlewareObject, opts) {
  if (typeof middlewareObject === 'string') {
    return require(middlewareObject)(ctx, opts[middlewareObject])
  }
  if (
    Array.isArray(middlewareObject) ||
    middlewareObject.series ||
    middlewareObject.parallel
  ) {
    if (Array.isArray(middlewareObject)) {
      middlewareObject = {
        series: middlewareObject
      };
    }
    let midObj = middlewareObject.series || middlewareObject.parallel;
    let runArray = middlewareObject.series ? runSeries : runParallel;
    if (Array.isArray(midObj)) {
      return runArray(ctx, server, midObj);
    }
  }
  return Promise.resolve({});
}

export default (ctx, middleware, opts = {}) => {
  const server = Server(ctx);
  const { debug } = server.logger(ctx.meta.executor);
  if (!ctx.meta.admin) {
    return server.response.json({ message: 'Forbidden' }, 403);
  }
  return run(ctx, middleware, opts)
    .then(ret => [merge({ args: ctx.args.args }, ret), ret.status || 200])
    .then(
    ([resp, status]) =>
      delete resp.status && server.response.json(resp, status)
    )
    .catch(e => {
      debug(e);
      return server.response.json(e, 500);
    });
};
