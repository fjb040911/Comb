'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    ctx.body = 'hi, egg';
  }
  async initDocker() {
    const { ip, name, describe } = ctx.request.body;
  }
}

module.exports = HomeController;
