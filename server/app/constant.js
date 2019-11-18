'use strict';

module.exports = Object.freeze({
  DEFAULT_ORG_PATH: 'admin', // 默认组织的路径
  AUTH_MAX_ERROR_COUNT: 5, // 认证错误最高次数
  FREEZING_TIME_AFTER_AUTH_ERROR: 5, // 认证错误后，账号冻结时长（分钟）
  AUTH_TOKEN_EXPIRES_TIME: 1200, // 认证token的失效时间(秒)
  ROLES: {
    SYSTEM_USER: 'SYSTEM_USER', // 系统管理员
    ORG_ADMIN: 'ORG_ADMIN', // 组织管理员
  },
  PROXY_SERVER_API: 'http://127.0.0.1:5555', // 代理管理模块的API
  BASE_SERVER: 'callfeel.com',
});
