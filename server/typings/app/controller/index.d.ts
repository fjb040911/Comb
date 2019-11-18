// This file is created by egg-ts-helper@1.25.6
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportCeryx = require('../../../app/controller/ceryx');
import ExportCustomer = require('../../../app/controller/customer');
import ExportHome = require('../../../app/controller/home');
import ExportServerManager = require('../../../app/controller/serverManager');

declare module 'egg' {
  interface IController {
    ceryx: ExportCeryx;
    customer: ExportCustomer;
    home: ExportHome;
    serverManager: ExportServerManager;
  }
}
