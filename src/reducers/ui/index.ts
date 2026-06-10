import { combineReducers } from 'redux';

import emblMapNav from './emblMapNav';
import sideNav from './sideNav';
import stuck from './stuck';
import sequenceMismatch from './sequenceMismatch';
import afConfidenceChainFilter from './afConfidenceChainFilter';

export default combineReducers({
  emblMapNav,
  sideNav,
  stuck,
  sequenceMismatch,
  afConfidenceChainFilter,
});

export const uiSelector = (state: GlobalState) => state.ui;
