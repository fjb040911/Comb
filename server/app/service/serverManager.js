'use strict';

const Service = require('egg').Service;
const constant = require('../constant')

class ServerManagerService extends Service {
  /**
   * 新增一个服务器
   * @param server
   * @returns {Promise<WriteOpResult | module:tls.Server | module:http.Server | module:https.Server | module:net.Server>}
   */
  async addServer(server) {
    console.log('add a server:', server);
    const s = new this.ctx.model.ServerManager(server);
    return await s.save();
  }

  /**
   * 生成一个容器
   * @param data
   * @returns {Promise<void>}
   */
  async addContainerOnServer(data) {
    console.log('-----addContainerOnServer----', data)
    const result = await this.ctx.curl(`http://${data.url}:7777/api/container/create`, {
      method: 'POST',
      contentType: 'json',
      data,
      // 明确告诉 HttpClient 以 JSON 格式处理返回的响应 body
      dataType: 'json',
    });
    return result;
  }

  /**
   * 管理容器
   * @param data
   * @param upgrade
   * @returns {Promise<void>}
   */
  async updateContainer(data, upgrade) {
    const result = await this.ctx.curl(`http://${data.url}:7777/api/container/${data.custId}/${data.action}`, {
      method: 'POST',
      contentType: 'json',
      data: upgrade,
      // 明确告诉 HttpClient 以 JSON 格式处理返回的响应 body
      dataType: 'json',
    });
    return result;
  }

  /**
   * 查询
   * @param query
   * @returns {Promise<*>}
   */
  async queryServers(query = {}) {
    console.log('this.ctx.model---', this.ctx.model)
    return await this.ctx.model.ServerManager.find(query);
  }

  /**
   * 根据 _id 获取到服务器信息
   * @param _id
   * @returns {Promise<TSchema>}
   */
  async getServerById(_id) {
    return await this.ctx.model.ServerManager.findOne({ _id });
  }

  // proxy API相关
  /**
   * 新增一个nginx代理
   * @param path 子域名前缀
   * @param ip
   * @returns {Promise<void>}
   */
  async addProxy(path, ip) {
    return await this.ctx.curl(`${constant.PROXY_SERVER_API}/api/routes/`, {
      method: 'POST',
      contentType: 'json',
      data: {
        source: `${path}.${constant.BASE_SERVER}`,
        target: ip,
      },
      dataType: 'json',
    });
  }

  /**
   * 查询生效的nginx代理
   * @returns {Promise<void>}
   */
  async queryProxyByApi() {
    return await this.ctx.curl(`${constant.PROXY_SERVER_API}/api/routes/`, {
      method: 'GET',
      contentType: 'json',
      dataType: 'json',
    });
  }

  /**
   * 动态更新nginx代理
   * @param oldPath
   * @param newPath
   * @param newTargetIp
   * @returns {Promise<void>}
   */
  async updateProxyByApi(oldPath, newPath, newTargetIp) {
    return await this.ctx.curl(`${constant.PROXY_SERVER_API}/api/routes/${oldPath}.${constant.BASE_SERVER}/`, {
      method: 'PUT',
      contentType: 'json',
      data: {
        source: `${newPath}.${constant.BASE_SERVER}`,
        target: newTargetIp,
      },
      dataType: 'json',
    });
  }

  /**
   * 动态删除nginx代理
   * @param path
   * @returns {Promise<void>}
   */
  async deleteProxyByApi(path) {
    return await this.ctx.curl(`${constant.PROXY_SERVER_API}/api/routes/${path}.${constant.BASE_SERVER}/`, {
      method: 'DELETE',
      contentType: 'json',
      dataType: 'json',
    });
  }
}
module.exports = ServerManagerService;
