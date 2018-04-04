// @flow
import { combineReducers } from 'redux';

import customLocation from './custom-location';
import dataProgress from './data-progress';
import jobs from './jobs';
import settings from './settings';
import toasts from './toasts';
import ui from './ui';

/*:: import type { CustomLocation } from './custom-location'; */
/*:: import type { DataProgress } from './data-progress'; */
/*:: import type { UI } from './ui'; */
/*:: export type State = {|
  customLocation: CustomLocation,
  dataProgress: DataProgress,
  ui: UI,
|}; */

export default combineReducers({
  customLocation,
  dataProgress,
  jobs,
  settings,
  toasts,
  ui,
});
