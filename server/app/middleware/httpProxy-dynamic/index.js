'use strict';

/**
 * http 请求动态代理。可根据一些条件动态请求到目标机器
 * add by jbfang
 * @type {(from: string, to: string) => string}
 */
const join = require('url').resolve;
const rp = require('request-promise-native');
const requestLib = require('request');

module.exports = function(options) {
  options || (options = {});

  if (!(options.host || options.map || options.url || options.asyncMap)) {
    throw new Error('miss options');
  }

  return async function proxy(ctx, next) {
    console.log('ctx-----', ctx.url)
    console.log('ctx url-----', ctx.request.url)
    console.log('ctx ip-----', ctx.request.ip)
    let url;
    if (options.asyncMap) {
      url = await options.asyncMap(ctx.path, ctx);
    } else {
      url = resolve(ctx.path, options, ctx);
    }
    if (typeof options.suppressRequestHeaders === 'object') {
      options.suppressRequestHeaders.forEach(function(h, i) {
        options.suppressRequestHeaders[i] = h.toLowerCase();
      });
    }

    var suppressResponseHeaders = []; // We should not be overwriting the options object!
    if (typeof options.suppressResponseHeaders === 'object') {
      options.suppressResponseHeaders.forEach(function(h, i) {
        suppressResponseHeaders.push(h.toLowerCase());
      });
    }

    // don't match
    if (!url) {
      return next();
    }

    // if match option supplied, restrict proxy to that match
    if (options.match) {
      if (!ctx.path.match(options.match)) {
        return next();
      }
    }

    var parsedBody = getParsedBody(ctx);

    var opt = {
      jar: options.jar === true,
      url: url + (ctx.querystring ? '?' + ctx.querystring : ''),
      headers: ctx.request.header,
      encoding: null,
      followRedirect: options.followRedirect === false ? false : true,
      method: ctx.method,
      body: parsedBody,
      simple: false,
      resolveWithFullResponse: true, // make request-promise respond with the complete response object
    };

    // set "Host" header to options.host (without protocol prefix), strip trailing slash
    if (options.host) {
      opt.headers.host = options.host
        .slice(options.host.indexOf('://') + 3)
        .replace(/\/$/, '');
    }

    if (options.requestOptions) {
      if (typeof options.requestOptions === 'function') {
        opt = options.requestOptions(ctx.request, opt);
      } else {
        Object.keys(options.requestOptions).forEach(function(option) {
          opt[option] = options.requestOptions[option];
        });
      }
    }

    for (let name in opt.headers) {
      if (
        options.suppressRequestHeaders &&
        options.suppressRequestHeaders.indexOf(name.toLowerCase()) >= 0
      ) {
        delete opt.headers[name];
      }
    }

    let res;
    if (parsedBody || ctx.method === 'GET') {
      res = await rp(opt);
    } else {
      res = await pipe(ctx.req, opt);
    }

    for (var name in res.headers) {
      if (suppressResponseHeaders.indexOf(name.toLowerCase()) >= 0) {
        continue;
      }
      if (name === 'transfer-encoding') {
        continue;
      }
      ctx.set(name, res.headers[name]);
    }

    if (options.overrideResponseHeaders) {
      for (let headerKey in options.overrideResponseHeaders) {
        ctx.set(headerKey, options.overrideResponseHeaders[headerKey]);
      }
    }

    ctx.body = ctx.body || res.body;
    ctx.status = res.statusCode;

    if (options.yieldNext) {
      return next();
    }
  };
};

function resolve(path, options, ctx) {
  let url = options.url;
  if (url) {
    if (!/^http/.test(url)) {
      url = options.host ? join(options.host, url) : null;
    }
    return ignoreQuery(url);
  }

  if (typeof options.map === 'object') {
    if (options.map && options.map[path]) {
      path = ignoreQuery(options.map[path]);
    }
  } else if (typeof options.map === 'function') {
    path = options.map(path, ctx);
  }
  // console.log('path--->', join(options.host, path))
  return options.host ? join(options.host, path) : path;
}

function ignoreQuery(url) {
  return url ? url.split('?')[0] : null;
}

function getParsedBody(ctx) {
  let body = ctx.request.body;
  if (body === undefined || body === null) {
    return undefined;
  }
  let contentType = ctx.request.header['content-type'];
  if (!Buffer.isBuffer(body) && typeof body !== 'string') {
    if (contentType && contentType.indexOf('json') !== -1) {
      body = JSON.stringify(body);
    } else {
      body = body + '';
    }
  }
  return body;
}

/**
 * Pipes the incoming request body through request()
 */
async function pipe(incomingRequest, opt) {
  return new Promise((resolve, reject) => {
    incomingRequest.pipe(requestLib(opt, (error, response) => {
      if (error) return reject(error);
      resolve(response);
    }));
  });
}
