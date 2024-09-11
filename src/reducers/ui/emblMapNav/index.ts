import { TOGGLE_EMBL_MAP_NAV, CLOSE_EVERYTHING, UIAction } from 'actions/types';

export default (state = false, action: UIAction) => {
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

export const emblMapNavSelector = (state: GlobalState) => state.ui.emblMapNav;
