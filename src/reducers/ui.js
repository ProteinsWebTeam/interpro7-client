import {combineReducers} from 'redux';
import {TOGGLE_SIDE_NAV, TOGGLE_EMBL_MAP_NAV} from 'actions/types';

export const sideNav = (state = false, action) => {
  switch (action.type) {
    case TOGGLE_SIDE_NAV:
      if (!action.status) return !state;
      return action.status === 'open';
    default:
      return state;
  }
};

export const emblMapNav = (state = false, action) => {
  switch (action.type) {
    case TOGGLE_EMBL_MAP_NAV:
      if (!action.status) return !state;
      return action.status === 'open';
    default:
      return state;
  }
};

export default combineReducers({sideNav, emblMapNav});
