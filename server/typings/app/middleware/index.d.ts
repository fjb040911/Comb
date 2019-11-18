// This file is created by egg-ts-helper@1.25.6
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportHttpProxyDynamicIndex = require('../../../app/middleware/httpProxy-dynamic/index');

declare module 'egg' {
  interface IMiddleware {
    httpProxyDynamic: {
      index: typeof ExportHttpProxyDynamicIndex;
    }
  }
}
