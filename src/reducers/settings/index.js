import { combineReducers } from 'redux';

import category from './category';

export default combineReducers({
  navigation: category('navigation'),
  tips: category('tips'),
  ui: category('ui'),
  cache: category('cache'),
  ebi: category('ebi'),
  api: category('api'),
  ipScan: category('ipScan'),
  genome3d: category('genome3d'),
});
