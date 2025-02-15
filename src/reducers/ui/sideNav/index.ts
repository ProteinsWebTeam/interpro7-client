import { TOGGLE_SIDE_NAV, CLOSE_EVERYTHING, UIAction } from 'actions/types';

export default (state = false, action: UIAction) => {
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

export const sideNavSelector = (state: GlobalState) => state.ui.sideNav;
