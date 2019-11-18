'use strict';
const errorCode = require('./errorCode');
const httpProxy = require('./middleware/httpProxy-dynamic')

const asyncMap = async function(path, ctx){
  console.log('proxy---', path, ctx.params);
  const { server } = ctx.params;
  const serverBean = await ctx.service.serverManager.getServerById(server)
  if (!serverBean) {
    console.error('Server is not found')
    ctx.body = errorCode.SYSTEM_OR_UNKNOWN_ERROR;
    return;
  }
  if (path.indexOf('/image/versionList') !== -1) {
    console.log('to get /image/versionList');
    return `http://${serverBean.ip}:7777/api/image/versionList`;
  }
  if (path.indexOf('/container/create') !== -1) {
    console.log('to post /container/create');
    return `http://${serverBean.ip}:7777/api/container/create`;
  }
  if (path.indexOf('/container/list') !== -1) {
    console.log('to post /container/list');
    return `http://${serverBean.ip}:7777/api/container/list`;
  }
}
console.log('constructor.name----', asyncMap.constructor.name)
const ProxyObj = httpProxy({ asyncMap })

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  /**
   * 查询服务器列表
   */
  router.get('/api/server/list', controller.serverManager.serverList);
  /**
   * 新增一台服务器
   */
  router.post('/api/server/add', controller.serverManager.addServer);
  /**
   * 删除一台服务节点
   */
  router.get('/api/server/:id/delete', controller.serverManager.serverDelete);

  /**
   *  查询客户列表
   */
  router.post('/api/cust/list', controller.customer.query);
  /**
   * 新增客户信息
   */
  router.post('/api/cust/add', controller.customer.addCustomer);

  /**
   * 启停服务
   */
  router.get('/api/cust/:custId/server/:action', controller.customer.startOrStopServer)
  /**
   * 升级服务
   */
  router.post('/api/cust/:custId/server/:action', controller.customer.upgradeServer)
  /**
   * 新增一个代理路径
   */
  router.post('/api/router/add', controller.serverManager.add);
  router.get('/api/router/list', controller.serverManager.list);
  router.get('/api/router/:path/delete', controller.serverManager.delete);
  router.post('/api/router/:oldPath/update', controller.serverManager.update);
  /**
   * 以下把部分管理容器的请求直接代理到对应的服务器上
   */
  /**
   * 获取某个服务器上的版本列表
   */
  router.get('/api/:server/image/versionList', ProxyObj);
  /**
   * 某个服务器上创建容器
   */
  router.post('/api/:server/container/create', ProxyObj);
  /**
   * 获取某个服务器上面运行的容器列表
   */
  router.post('/api/:server/container/list', ProxyObj);
};

