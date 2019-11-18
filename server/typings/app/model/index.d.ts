// This file is created by egg-ts-helper@1.25.6
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportCustomerManager = require('../../../app/model/customerManager');
import ExportServerManager = require('../../../app/model/serverManager');

declare module 'egg' {
  interface IModel {
    CustomerManager: ReturnType<typeof ExportCustomerManager>;
    ServerManager: ReturnType<typeof ExportServerManager>;
  }
}
