'use strict';

const Service = require('egg').Service;
const constant = require('../constant')
const _ = require('lodash');

class CustomerManagerService extends Service {
  /**
   * 新增一个客户
   * @param cust
   * @returns {Promise<WriteOpResult | module:tls.Server | module:http.Server | module:https.Server | module:net.Server>}
   */
  async addCust(cust) {
    console.log('add a cust:', cust);
    const s = new this.ctx.model.CustomerManager(cust);
    return await s.save();
  }

  /**
   * 查询
   * @param query
   * @returns {Promise<*>}
   */
  async queryCust(query = {}, { current = 1, pageSize = 15 }) {
    console.log('this.ctx.model---', this.ctx.model)
    const list = await this.ctx.model.CustomerManager.find(query).limit(pageSize).skip((current - 1) * pageSize).populate('server');
    const total = await this.ctx.model.CustomerManager.find(query).count();
    return {
      list,
      pagination: {
        current,
        pageSize,
        total,
      },
    };
  }

  async getById(_id) {
    return await this.ctx.model.CustomerManager.findOne({ _id }).populate('server');
  }

  /**
   * 返回一个可用的端口
   * @param server
   * @returns {Promise<*>}
   */
  async getPort(server) {
    const port = _.random(9000, 9999);
    const cust = await this.ctx.model.CustomerManager.findOne({ server, port });
    if (cust) {
      console.info('Port of:', port, ' is be used by cust：', cust);
      return await getPort(server);
    }
    return port;
  }
}
module.exports = CustomerManagerService;
