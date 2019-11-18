// This file is created by egg-ts-helper@1.25.6
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportCustomerManager = require('../../../app/service/customerManager');
import ExportServerManager = require('../../../app/service/serverManager');

declare module 'egg' {
  interface IService {
    customerManager: ExportCustomerManager;
    serverManager: ExportServerManager;
  }
}
