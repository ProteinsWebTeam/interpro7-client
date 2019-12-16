// @flow
import { combineReducers } from 'redux';

import emblMapNav from './emblMapNav';
import sideNav from './sideNav';
import stuck from './stuck';
import idaAccessionDB from './idaAccessionDB';

/*:: import type { EMBLMapNav } from './emblMapNav'; */
/*:: import type { SideNav } from './sideNav'; */
/*:: import type { Stuck } from './stuck'; */
/*:: import type { AccessionDB } from './idaAccessionDB'; */
/*:: export type UI = {|
  emblMapNav: EMBLMapNav,
  sideNav: SideNav,
  stuck: Stuck,
  idaAccessionDB: AccessionDB,
|}; */
/*:: import type { State } from 'reducers'; */

export default (combineReducers({
  emblMapNav,
  sideNav,
  stuck,
  idaAccessionDB,
}) /*: (UI | void, any) => UI */);

export const uiSelector = (state /*: State */) => state.ui;
