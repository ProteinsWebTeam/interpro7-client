import { NEW_PROCESSED_CUSTOM_LOCATION } from 'actions/types';
import { LocationAction } from 'actions/creators';

export default (state: InterProLocationSearch = {}, action: LocationAction) => {
  switch (action.type) {
    case NEW_PROCESSED_CUSTOM_LOCATION:
      return action.customLocation.search || {};
    default:
      return state;
  }
};

export const searchSelector = (state: GlobalState) =>
  state.customLocation.search;
