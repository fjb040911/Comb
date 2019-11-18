'use strict';

const result = (res, errorCode, msg, data) => {
  return { res, data, errorCode, msg };
};

module.exports = {
  // ---------------------------begin public errorCode-------------------------------
  // 标准正确请求的应答
  RESPONE: (data = {}, msg) => {
    return result(1, 200, msg, data);
  },
  // 系统错误或者未知错误
  SYSTEM_OR_UNKNOWN_ERROR: result(-1, 1000, 'Unknown error'),
  // 3000-3999 账号和认证和权限相关的错误码
  // 认证用户未找到
  AUTH_USER_NO_FOUND: result(-1, 3001, 'User no found'),
  // 认证密码错误
  AUTH_USER_PASSWORD_ERROR: result(-1, 3002, 'Password error'),
  // 认证错误的次数过多
  AUTH_USER_TOO_MANY_ERRORS: result(-1, 3003, 'Too many authentication errors'),
  // 用户被冻结或者状态无效
  AUTH_USER_INVALID_USER: result(-1, 3004, 'Invalid user'),
  // 无效的认证凭证
  AUTH_USER_INVALID_ACCESS_TOKEN: result(-1, 3005, 'Invalid access token'),
  // token 过期
  AUTH_USER_ACCESS_TOKEN_EXPIRE: result(-1, 3006, 'Access token expire'),
  // 所属组织已经无效
  AUTH_USER_INVALID_ORG: result(-1, 3007, 'Invalid organization'),
  // 所属组织未找到
  AUTH_ORG_NO_FOUND: result(-1, 3008, 'org no found'),
  // 无此权限
  AUTH_NO_PERMISSION: result(-1, 3009, 'No permission'),
  // 4000-4999 搜索相关错误码
  // 查询条件为空
  QUERY_CONDITION_IS_EMPTY: result(-1, 4001, 'Query condition is empty'),
  // 查询条件缺失
  QUERY_CONDITION_MISSING: result(-1, 4002, 'Query condition missing'),
  // 数据未找到
  QUERY_DATA_NO_FOUND: result(-1, 4003, 'Query data no found'),
  // 5000-5999 数据处理相关
  // 保存数据错误
  DATA_SAVE_ERROR: result(-1, 5001, 'Data save error'),
  // 数据更新失败，已不是最新版本
  DATA_UPDATE_ERROR_VERSION: result(-1, 5002, 'Data update error'),
  // 数据更新失败，数据已经不存在
  DATA_UPDATE_ERROR_NO_FOUND: result(-1, 5003, 'Data update error, no found'),
  // 数据删除失败
  DATA_REMOVE_ERROR: result(-1, 5004, 'Data remove error'),
  // 必要参数缺失
  DATA_MISSING_PARAMETERS: result(-1, 5005, 'Missing essential parameters'),
  // ---------------------------end public errorCode-------------------------------
  // ------------------------------------------------------------------------------
  // ---------------------------begin business errorCode---------------------------
  // 6000-6999 业务相关的代码
  EMAIL_ALREADY_EXISTS: result(-1, 6001, 'Email already exists'),
  ORG_PATH_ALREADY_EXISTS: result(-1, 6002, 'Org path already exists'),
};
