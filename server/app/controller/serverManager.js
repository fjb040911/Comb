'use strict';

const Controller = require('egg').Controller;
const errorCode = require('../errorCode');

class ServerManagerController extends Controller {
  /**
   * 查询服务器列表
   * @returns {Promise<void>}
   */
  async serverList() {
    const { ctx } = this;
    const serverList = await ctx.service.serverManager.queryServers();
    ctx.body = errorCode.RESPONE(serverList);
  }
  /**
   * 新增一台服务器
   * @returns {Promise<void>}
   */
  async addServer() {
    const { ctx } = this;
    const { ip, name, describe } = ctx.request.body;
    const addResult = await ctx.service.serverManager.addServer({ ip, name, describe });
    console.log('addServer Result --->', addResult);
    ctx.body = errorCode.RESPONE(addResult);
  }

  async serverDelete() {
    const { ctx } = this;
    const { id } = ctx.params;
    const serverResult = await ctx.service.serverManager.getServerById(id);
    if (serverResult) {
      serverResult.remove();
    }
    ctx.body = errorCode.RESPONE(serverResult,'Remove success');
  }

  async add() {
    const { ctx } = this;
    const { path, ip, name, describe } = ctx.request.body;
    const addResult = await ctx.service.serverManager.addProxy(path, ip);

    console.log('excResult--->', addResult.data);
    ctx.body = addResult.data;
  }
  async list() {

    const result = await this.ctx.service.serverManager.queryProxyByApi();
    this.ctx.body = result.data;
  }
  async delete() {
    const { ctx } = this;
    const { path } = ctx.params;
    const result = await ctx.service.serverManager.deleteProxyByApi(path);
    ctx.body = result.data;
  }

  async update() {
    const { path, ip, name, describe } = this.ctx.request.body;
    const { oldPath } = this.ctx.params;
    const result = await this.ctx.service.serverManager.updateProxyByApi(oldPath, path, ip);
    console.log('update result=>', result);
    this.ctx.body = result.data;
  }
}

module.exports = ServerManagerController;
