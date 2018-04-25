// @flow
import { TOGGLE_SIDE_NAV, CLOSE_EVERYTHING } from 'actions/types';

/*:: export type SideNav = boolean; */
/*:: import type { State } from 'reducers'; */

export default (state /*: SideNav */ = false, action /*: Object */) => {
  switch (action.type) {
    case TOGGLE_SIDE_NAV:
      if (!action.status) return !state;
      return action.status === 'open';
    case CLOSE_EVERYTHING:
      return false;
    default:
      return state;
  }
};

export const sideNavSelector = (state /*: State */) => state.ui.sideNav;
