// @flow
import { STUCK, UNSTUCK } from 'actions/types';

/*:: export type Stuck = boolean; */
/*:: import type { State } from 'reducers'; */

export default (state /*: Stuck */ = false, action /*: Object */) => {
  switch (action.type) {
    case STUCK:
      return true;
    case UNSTUCK:
      return false;
    default:
      return state;
  }
};

export const stuckSelector = (state /*: State */) => state.ui.stuck;
