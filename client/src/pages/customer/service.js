import { get, post } from '@/utils/ajax';

export async function getServerList() {
  return get('/api/server/list')
}

export async function getCustList() {
  return post('/api/cust/list')
}

export async function addCust(data) {
  return post('/api/cust/add', data)
}

export async function getVersionList(server) {
  return get(`/api/${server}/image/versionList`)
}

export async function custServerAction({ cust, action }) {
  return get(`/api/cust/${cust}/server/${action}`);
}

export async function upgradeServer({ cust, action, data }) {
  return post(`/api/cust/${cust}/server/${action}`, data);
}
