import {STUCK, UNSTUCK} from 'actions/types';

export default (state = false, action) => {
  switch (action.type) {
    case STUCK:
      return true;
    case UNSTUCK:
      return false;
    default:
      return state;
  }
};
