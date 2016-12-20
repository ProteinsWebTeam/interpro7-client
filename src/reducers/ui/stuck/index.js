// @flow
import {STUCK, UNSTUCK} from 'actions/types';

export default (state/*: boolean */ = false, action/*: Object */) => {
  switch (action.type) {
    case STUCK:
      return true;
    case UNSTUCK:
      return false;
    default:
      return state;
  }
};
