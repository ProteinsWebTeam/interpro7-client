// @flow
import { combineReducers } from 'redux';

import customLocation from './customLocation';
import ui from './ui';
import settings from './settings';
import data from './data';
import jobs from './jobs';
import toasts from './toasts';

export default combineReducers({
  customLocation,
  ui,
  settings,
  data,
  jobs,
  toasts,
});
