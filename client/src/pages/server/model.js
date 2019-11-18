import { message } from 'antd';
import { fakeSubmitForm, getServerList, addServer, removeServer } from './service';
import { findIndex } from 'lodash';

const Model = {
  namespace: 'serverNode',
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
      const result = yield call(addServer, payload);
      console.log('add result:', result)
      yield put({
        type: 'addServer',
        payload: result.data,
      })
    },
    *remove({ payload }, { call, put }) {
      const result = yield call(removeServer, payload);
      console.log('add result:', result)
      yield put({
        type: 'removeServer',
        payload,
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
    },
    removeServer(state, action) {
      let { serverList } = state;
      const index = findIndex(serverList, item => item._id === action.payload)
      if (index !== -1) {
        serverList.splice(index, 1)
      }
      return { ...state, serverList };
    }
  },
};
export default Model;
