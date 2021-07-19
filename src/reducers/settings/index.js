import { combineReducers } from 'redux';

import category from './category';

export default combineReducers({
  navigation: category('navigation'),
  notifications: category('notifications'),
  ui: category('ui'),
  cache: category('cache'),
  ebi: category('ebi'),
  api: category('api'),
  ipScan: category('ipScan'),
  genome3d: category('genome3d'),
  wikipedia: category('wikipedia'),
  modelAPI: category('modelAPI'),
});
