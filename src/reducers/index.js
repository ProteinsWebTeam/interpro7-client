// @flow
import { combineReducers } from 'redux';

import customLocation from './custom-location';
import dataProgress from './data-progress';
import jobs from './jobs';
import settings from './settings';
import status from './status';
import toasts from './toasts';
import ui from './ui';

import 'utils/global-message';

/*:: import type { CustomLocation } from './custom-location'; */
/*:: import type { DataProgress } from './data-progress'; */
/*:: import type { Status } from './status'; */
/*:: import type { UI } from './ui'; */
/*:: export type State = {|
  customLocation: CustomLocation,
  dataProgress: DataProgress,
  jobs: *,
  settings: *,
  status: Status,
  toasts: *,
  ui: UI,
|}; */

export default combineReducers({
  customLocation,
  dataProgress,
  jobs,
  settings,
  status,
  toasts,
  ui,
});
