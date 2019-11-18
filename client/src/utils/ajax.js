/**
 *  add by Jianbing Fang
 */
import request from './request';
import router from 'umi/router';
import { notification } from 'antd';
import { SYSTEM_PATH } from '@/utils/constants';
/**
 * 全局的处理
 */
request.interceptors.response.use(async (response, options) => {
  console.log('response-->', response);
  if (response.status !== 200) {
    if (response.status === 401) {
      // 鉴权失败，跳转到登录
      notification.error({
        message: '请重新登录',
        description: '授权失败或者已过期',
      });
      router.replace({
        pathname: '/user/login',
      });
    }
    return { res: -1, status: response.status }
  }
  const data = await response.clone().json();
  console.info('http response:', data);
  return response;
});

const post = (path, params) => request(path, {
  method: 'post',
  data: { ...params },
});
const get = (path) => request(path, {
  method: 'get',
});
export { post, get };
