import { getServerList, getCustList, addCust, getVersionList, custServerAction, upgradeServer } from './service';
import { findIndex } from 'lodash';

const Model = {
  namespace: 'customer',
  state: {
    versionList: [],
    serverList: [],
    data: {
      list: [],
      pagination: {},
    },
  },
  effects: {
    *fetchServerList({ payload }, { call, put }) {
      const response = yield call(getServerList, payload);
      if (response.res > 0) {
        yield put({
          type: 'saveServerList',
          payload: response.data,
        });
      }
    },
    *fetch({ payload }, { call, put }) {
      const response = yield call(getCustList, payload);
      yield put({
        type: 'save',
        payload: response.data,
      });
    },

    *add({ payload }, { call, put }) {
      const response = yield call(addCust, payload);
      yield put({
        type: 'commitAdd',
        payload: response.data,
      });
    },
    *fetchVersionList({ payload }, { call, put }) {
      const response = yield call(getVersionList, payload);
      console.log('fetchVersionList-------', response)
      yield put({
        type: 'setVersionList',
        payload: response.data,
      });
    },
    /**
     * 改变容器的状态
     * @param payload
     * @param call
     * @param put
     * @returns {IterableIterator<*>}
     */
    *updateContainerState({ payload }, { call, put }) {
      const response = yield call(custServerAction, payload);
      console.log('updateContainerState-------', response)
      yield put({
        type: 'setCustState',
        payload: response.data,
      });
    },
    *toUpgradeServer({ payload }, { call, put }) {
      const response = yield call(upgradeServer, payload);
      console.log('toUpgradeServer-------', response)
      yield put({
        type: 'setCustState',
        payload: response.data,
      });
    }
  },
  reducers: {
    save(state, action) {
      return { ...state, data: action.payload };
    },
    saveServerList(state, action) {
      return { ...state, serverList: action.payload };
    },
    commitAdd(state, action) {
      let { data } = state;
      console.log('data------', data)
      data.list.unshift(action.payload)
      return { ...state, data };
    },
    setVersionList(state, action) {
      return { ...state, versionList: action.payload };
    },
    setCustState(state, action) {
      const itemIndex = findIndex(state.data.list, item => item._id === action.payload._id)
      if (itemIndex !== -1) {
        state.data.list[itemIndex] = action.payload
        return { ...state }
      }
    }
  },
};
export default Model;
