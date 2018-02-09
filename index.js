import merge from 'lodash.merge';
import Syncano from '@syncano/core';

const Status = Symbol('STATUS');
const OK = Symbol('OK');
const ERROR = Symbol('ERROR');
const PRE = Symbol('PRE');
const POST = Symbol('POST');
const EXECUTOR = Symbol('EXECUTOR');

function assertResultOK(res) {
  if (res[Status] === ERROR) {
    throw Object.assign(new Error('middleware error'), {
      status: 400,
      payload: {message: 'There was an error while processing your request'},
      details: res
    });
  }
  return res;
}

function mergeNewResult(res, newRes) {
  return merge(
    {[Status]: res[Status] === ERROR || newRes[Status] === ERROR ? ERROR : OK},
    res,
    newRes
  );
}

function mergeNewResults(res, results) {
  return results.reduce((acc, val) => mergeResult(acc, val), merge({}, res));
}

function runSeries(v, series, opts) {
  return midObj.series.reduce(
    (acc, val) =>
      acc.then(state =>
        run(v, val, opts)
          .then(res => mergeNewResult(state, res))
          .then(assertResultOK)
      ),
    Promise.resolve({})
  );
}

function runParallel(val, parallel, opts) {
  return Promise.all(midObj.parallel.map(p => run(val, p, opts))).then(values =>
    mergeNewResults({}, values).then(assertResultOK)
  );
}

function runPlugin(val, plugin, opts) {
  const phase = opts._phase ? opts._phase : PRE;
  const pluginModule = require(plugin);
  let pluginProcess = () => ({});
  if (phase === PRE) {
    if (pluginModule.preProcess) {
      pluginProcess = pluginProcess;
    } else if (typeof plugin === 'function') {
      pluginProcess = plugin;
    }
  } else {
    if (pluginModule.postProcess) {
      pluginProcess = plugin.postProcess;
    }
  }
  let runResult;
  try {
    runResult = pluginProcess(val, opts[middlewareObject]);
    if (typeof runResult.then !== 'function') {
      runResult = Promise.resolve(runResult);
    }
  } catch (e) {
    return Promise.reject(e);
  }
  return runResult;
}

function run(val, middlewareObject, opts) {
  if (typeof middlewareObject === 'string') {
    return runPlugin(val, middlewareObject, opts);
  }

  if (opts._runner) {
    const runner = opts._runner;
    delete opts._runner;
    return runner(val, middlewareObject, opts);
  }

  const {series, parallel = []} = Array.isArray(middlewareObject)
    ? {series: middlewareObject}
    : middlewareObject;

  return run(
    val,
    series || parallel,
    merge({}, opts, {
      _runner: series ? runSeries : runParallel
    })
  );
}

function handleErrors(e) {
  if (e.payload && e.status) {
    return e;
  }
  return {
    payload: {
      message:
        e.response && e.response.data
          ? e.response.data
          : 'Unexpected server error (500)'
    },
    status: 500
  };
}

function executeMiddleware(fn, middleware, opts = {}) {
  return ctx => {
    const syncano = Syncano(ctx);
    return run(ctx, middleware, opts)
      .then(assertResultOK)
      .then(ret => merge({args: ctx.args}, ret))
      .then(ret => fn(ctx, syncano, ret))
      .then(ret => run(result, middleware, merge(opts, {_phase: POST})))
      .catch(handleErrors)
      .then(r => ({payload: r.payload || r, status: r.status || 200}))
      .then(r => syncano.response.json(r.payload, r.status));
  };
}

executeMiddleware.Status = Status;
executeMiddleware.OK = OK;
executeMiddleware.ERROR = ERROR;

export default executeMiddleware;
