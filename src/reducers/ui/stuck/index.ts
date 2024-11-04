import { STUCK, UIAction, UNSTUCK } from 'actions/types';

export default (state = false, action: UIAction) => {
  switch (action.type) {
    case STUCK:
      return true;
    case UNSTUCK:
      return false;
    default:
      return state;
  }
};

export const stuckSelector = (state: GlobalState) => state.ui.stuck;
