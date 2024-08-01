import { combineReducers } from 'redux';

import browser from './browser';
import servers from './servers';

export default combineReducers({
  browser,
  servers,
});

export const statusSelector = (state: GlobalState) => state.status;
