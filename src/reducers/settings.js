import {CHANGE_SETTINGS, RESET_SETTINGS} from 'actions/types';
import settingsStorage from 'storage/settings';
import config from 'config';

const DEFAULT_HTTP_PORT = 80;
const getDefaultSettings = () => ({
  pagination: {
    pageSize: config.pagination.pageSize,
  },
  ui: {},
  cache: {},
  api: {
    hostname: config.root.API.hostname,
    port: config.root.API.port || DEFAULT_HTTP_PORT,
    root: config.root.API.pathname,
  },
});

export default (
  state = settingsStorage.getValue() || getDefaultSettings(),
  action
) => {
  switch (action.type) {
    case CHANGE_SETTINGS:
      return {
        ...state,
        [action.category]: {
          ...state[action.category],
          [action.key]: action.value,
        },
      };
    case RESET_SETTINGS:
      return action.value || getDefaultSettings();
    default:
      return state;
  }
};
