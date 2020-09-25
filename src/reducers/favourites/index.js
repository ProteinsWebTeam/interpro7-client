// @flow
import { MARK_FAVOURITE, UNMARK_FAVOURITE } from 'actions/types';

const initialFavState = {
  entries: [],
};

export default (
  state /*: Object */ = initialFavState,
  action /*: Object */,
) => {
  switch (action.type) {
    case MARK_FAVOURITE:
      return {
        ...state,
        entries: [...state.entries, action.id],
      };
    case UNMARK_FAVOURITE:
      return {
        ...state,
        entries: [...state.entries.filter((item) => item !== action.id)],
      };
    default:
      return state;
  }
};
