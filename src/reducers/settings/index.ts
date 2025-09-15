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
  repeatsDB: category('repeatsDB'),
  disprot: category('disprot'),
  wikipedia: category('wikipedia'),
  alphafold: category('alphafold'),
  bfvd: category('bfvd'),
  proteinsAPI: category('proteinsAPI'),
});
