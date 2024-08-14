import { LocationAction, NEW_PROCESSED_CUSTOM_LOCATION } from 'actions/types';

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
