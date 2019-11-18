import { message } from 'antd';
import defaultSettings from '../../config/defaultSettings';
import themeColorClient from '../components/SettingDrawer/themeColorClient';

const updateTheme = newPrimaryColor => {
  if (newPrimaryColor) {
    const timeOut = 0;
    const hideMessage = message.loading('正在切换主题！', timeOut);
    themeColorClient.changeColor(newPrimaryColor).finally(() => hideMessage());
  }
};

const updateColorWeak = colorWeak => {
  const root = document.getElementById('root');

  if (root) {
    root.className = colorWeak ? 'colorWeak' : '';
  }
};

const SettingModel = {
  namespace: 'settings',
  state: defaultSettings,
  reducers: {
    getSetting(state = defaultSettings) {
      const setting = {};
      const urlParams = new URL(window.location.href);
      Object.keys(state).forEach(key => {
        if (urlParams.searchParams.has(key)) {
          const value = urlParams.searchParams.get(key);
          setting[key] = value === '1' ? true : value;
        }
      });
      const { primaryColor, colorWeak } = setting;

      if (primaryColor && state.primaryColor !== primaryColor) {
        updateTheme(primaryColor);
      }

      updateColorWeak(!!colorWeak);
      return { ...state, ...setting };
    },

    changeSetting(state = defaultSettings, { payload }) {
      const urlParams = new URL(window.location.href);
      Object.keys(defaultSettings).forEach(key => {
        if (urlParams.searchParams.has(key)) {
          urlParams.searchParams.delete(key);
        }
      });
      Object.keys(payload).forEach(key => {
        if (key === 'collapse') {
          return;
        }

        let value = payload[key];

        if (value === true) {
          value = 1;
        }

        if (defaultSettings[key] !== value) {
          urlParams.searchParams.set(key, value);
        }
      });
      const { primaryColor, colorWeak, contentWidth } = payload;

      if (primaryColor && state.primaryColor !== primaryColor) {
        updateTheme(primaryColor);
      }

      if (state.contentWidth !== contentWidth && window.dispatchEvent) {
        window.dispatchEvent(new Event('resize'));
      }

      updateColorWeak(!!colorWeak);
      window.history.replaceState(null, 'setting', urlParams.href);
      return { ...state, ...payload };
    },
  },
};
export default SettingModel;
