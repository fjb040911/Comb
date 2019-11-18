import request from '@/utils/request';
import { get, post } from '@/utils/ajax';

export async function fakeSubmitForm(params) {
  return request('/api/forms', {
    method: 'POST',
    data: params,
  });
}

export async function getServerList() {
  return get('/api/server/list')
}

export async function addServer(data) {
  return post('/api/server/add', data)
}

export async function removeServer(id) {
  return get(`/api/server/${id}/delete`)
}
