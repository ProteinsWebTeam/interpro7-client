// @flow
import { combineReducers } from 'redux';

import customLocation from './customLocation';
import newLocation from './newLocation';
import ui from './ui';
import settings from './settings';
import data from './data';
import toasts from './toasts';

export default combineReducers({
  customLocation,
  newLocation,
  ui,
  settings,
  data,
  toasts,
});
