/* eslint valid-jsdoc: "off" */

'use strict';
function proxyHost(req, res) {
  console.log('proxyHost-----', req, res);
  return 'http://12122.com';
}

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1571194727593_8313';

  // add your middleware config here
  config.middleware = [];

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };
  config.mongoose = {
    url: 'mongodb://saasadmin:oal2019@139.196.196.163:27017/SaasServer',
    options: {},
  };
  config.security = {
    csrf: {
      enable: false,
    },
  };

  return {
    ...config,
    ...userConfig,
  };
};
