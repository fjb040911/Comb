const Controller = require('egg').Controller;
const errorCode = require('../errorCode');
const uuid = require('uuid');

class Customer extends Controller {
  /**
   * 新增一个客户
   * @returns {Promise<void>}
   */
  async addCustomer() {
    const { ctx } = this;
    const { name, describe, domain, expiryDate, server, serverVersion, versionName } = ctx.request.body;
    const containerName = uuid.v1();
    const serverBean = await ctx.service.serverManager.getServerById(server)
    const newPort = await ctx.service.customerManager.getPort(server)
    console.log('addCustomer fof new Port is:', newPort);
    const addResult = await ctx.service.customerManager.addCust({ name, describe, domain, server, port: newPort, expiryDate: new Date(expiryDate), serverVersion, versionName, containerName });
    console.log('to create an Container');
    addResult.server = serverBean;
    ctx.service.serverManager.addContainerOnServer({ url: serverBean.ip, app: versionName, agentId: containerName, port: newPort })
    console.log('to create a Container');
    setTimeout(() => {
      ctx.service.serverManager.addProxy(domain, `http://${serverBean.ip}:${newPort}`);
    }, 10000);
    // const addProxyResult = await ctx.service.serverManager.addProxy(domain, `http://${serverBean.ip}:${port}`);
    // console.log('to create a Proxy', addProxyResult);
    ctx.body = errorCode.RESPONE(addResult);
  }

  /**
   *查询列表
   * @returns {Promise<void>}
   */
  async query() {
    const { ctx } = this;
    const queryListResult = await ctx.service.customerManager.queryCust({},{})
    console.log('getCustList queryResult:', queryListResult);
    this.ctx.body = errorCode.RESPONE(queryListResult);
  }

  async startOrStopServer() {
    const { custId, action } = this.ctx.params;
    const custInfo = await this.ctx.service.customerManager.getById(custId)
    console.log('custInfo:', custInfo);
    if (custInfo) {
      const updateResult = await this.ctx.service.serverManager.updateContainer({ url: custInfo.server.ip, custId: custInfo.containerName, action });
      console.log('updateResult---->', updateResult);
      const stateMap = {
        'stop': 0,
        'start': 1,
      }
      custInfo.state = stateMap[action];
      custInfo.save()
      this.ctx.body = errorCode.RESPONE(custInfo)
      return;
    }
    this.ctx.body = errorCode.QUERY_DATA_NO_FOUND;
  }

  /**
   * 升级一个客户的服务容器
   * @returns {Promise<void>}
   */
  async upgradeServer() {
    const { custId, action } = this.ctx.params;
    const custInfo = await this.ctx.service.customerManager.getById(custId)
    const containerName = uuid.v1();
    console.log('custInfo:', custInfo);
    if (custInfo) {
      const newPort = await this.ctx.service.customerManager.getPort(custInfo.server)
      console.log('upgradeServer newPort:', newPort)
      const { serverVersion, versionName } = this.ctx.request.body;
      const upgradeData = {
        app: versionName, agentId: containerName, port: newPort,
      }
      const updateResult = await this.ctx.service.serverManager.updateContainer({ url: custInfo.server.ip, custId: custInfo.containerName, action }, upgradeData);
      setTimeout(() => {
        this.ctx.service.serverManager.updateProxyByApi(custInfo.domain, custInfo.domain, `http://${custInfo.server.ip}:${newPort}`);
      }, 1000);
      console.log('updateResult--->', updateResult)
      custInfo.serverVersion = serverVersion
      custInfo.versionName = versionName
      custInfo.containerName = containerName;
      custInfo.port = newPort
      custInfo.save()
      this.ctx.body = errorCode.RESPONE(custInfo)
      return;
    }
    this.ctx.body = errorCode.QUERY_DATA_NO_FOUND;
  }
}

module.exports = Customer;
