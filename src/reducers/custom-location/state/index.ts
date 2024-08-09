// TODO: I'm not sure if location.state: is used any more (see location middleware), investgate if can be removed

import { LocationAction, NEW_PROCESSED_CUSTOM_LOCATION } from 'actions/types';

export default (state: InterProLocationSearch = {}, action: LocationAction) => {
  switch (action.type) {
    case NEW_PROCESSED_CUSTOM_LOCATION:
      return action.state || {};
    default:
      return state;
  }
};

export const locationStateSelector = (state: GlobalState) =>
  state.customLocation.state;
