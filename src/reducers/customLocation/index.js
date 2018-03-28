// @flow
import { combineReducers } from 'redux';

import description from './description';
import search from './search';
import hash from './hash';
import state from './state';

/*:: import type { Description } from 'utils/processDescription/handlers'; */
/*:: import type { Search } from './search'; */
/*:: import type { Hash } from './hash'; */
/*:: import type { LocationState } from './state'; */
/*:: export type CustomLocation = {|
  description: Description,
  search: Search,
  hash: Hash,
  state: LocationState,
|}; */
/*:: import type { State } from 'reducers'; */

export default combineReducers({ description, search, hash, state });

export const customLocationSelector = (state /*: State */) =>
  state.customLocation;
