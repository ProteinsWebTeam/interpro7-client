import { combineReducers } from 'redux';

import emblMapNav from './emblMapNav';
import sideNav from './sideNav';
import stuck from './stuck';

export default combineReducers({
  emblMapNav,
  sideNav,
  stuck,
});

export const uiSelector = (state: GlobalState) => state.ui;
