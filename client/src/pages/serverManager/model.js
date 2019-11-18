import { message } from 'antd';
import { fakeSubmitForm, getServerList, addServer, removeServer } from './service';

const Model = {
  namespace: 'serverNodebak',
  state: {
    serverList: [],
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      console.log('fetch :')
      const result = yield call(getServerList, payload);
      console.log('fetch result:', result)
      yield put({
        type: 'save',
        payload: result.data,
      })
    },
    *add({ payload }, { call, put }) {
      const result = yield call(getServerList, payload);
      console.log('add result:', result)
      yield put({
        type: 'addServer',
        payload: result.data,
      })
    },
  },
  reducers: {
    save(state, action) {
      return { ...state, serverList: action.payload };
    },
    addServer(state, action) {
      let { serverList } = state;
      serverList.push(action.payload)
      return { ...state, serverList };
    }
  },
};
export default Model;
