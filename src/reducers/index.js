// @flow
import { combineReducers } from 'redux';

import customLocation from './customLocation';
import data from './data';
import jobs from './jobs';
import settings from './settings';
import toasts from './toasts';
import ui from './ui';

/*:: import type { CustomLocation } from './customLocation'; */
/*:: import type { Data } from './data'; */
/*:: import type { UI } from './ui'; */
/*:: export type State = {|
  customLocation: CustomLocation,
  data: Data,
  ui: UI,
|}; */

export default combineReducers({
  customLocation,
  data,
  jobs,
  settings,
  toasts,
  ui,
});
