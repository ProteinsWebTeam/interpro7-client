// @flow
import { TOGGLE_EMBL_MAP_NAV, CLOSE_EVERYTHING } from 'actions/types';

/*:: export type EMBLMapNav = boolean; */
/*:: import type { State } from 'reducers'; */

export default (state /*: EMBLMapNav */ = false, action /*: Object */) => {
  switch (action.type) {
    case TOGGLE_EMBL_MAP_NAV:
      if (!action.status) return !state;
      return action.status === 'open';
    case CLOSE_EVERYTHING:
      return false;
    default:
      return state;
  }
};

export const emblMapNavSelector = (state /*: State */) => state.ui.emblMapNav;
