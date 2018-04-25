// @flow
import { combineReducers } from 'redux';

import emblMapNav from './emblMapNav';
import sideNav from './sideNav';
import stuck from './stuck';

/*:: import type { EMBLMapNav } from './emblMapNav'; */
/*:: import type { SideNav } from './sideNav'; */
/*:: import type { Stuck } from './stuck'; */
/*:: export type UI = {|
  emblMapNav: EMBLMapNav,
  sideNav: SideNav,
  stuck: Stuck,
|}; */
/*:: import type { State } from 'reducers'; */

export default combineReducers({ emblMapNav, sideNav, stuck });

export const uiSelector = (state /*: State */) => state.ui;
