// @flow
import { combineReducers } from 'redux';

import category from './category';

export default combineReducers({
  navigation: category('navigation'),
  ui: category('ui'),
  cache: category('cache'),
  ebi: category('ebi'),
  api: category('api'),
  ipScan: category('ipScan'),
});
