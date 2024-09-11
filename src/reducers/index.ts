import { combineReducers } from 'redux';

import customLocation from './custom-location';
import dataProgress from './data-progress';
import download from './download';
import favourites from './favourites';
import jobs from './jobs';
import settings from './settings';
import status from './status';
import toasts from './toasts';
import ui from './ui';

// TODO: If nothing breaks by InterPro 102.0 Delete the inport and the utility class
// I don't think this is in use, can we remove it?
// import 'utils/global-message';

export default combineReducers({
  customLocation,
  dataProgress,
  download,
  favourites,
  jobs,
  settings,
  status,
  toasts,
  ui,
});
