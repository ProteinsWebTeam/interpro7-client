import { NEW_PROCESSED_CUSTOM_LOCATION } from 'actions/types';
import { LocationAction } from 'actions/creators';

export default (state: string = '', action: LocationAction) => {
  switch (action.type) {
    case NEW_PROCESSED_CUSTOM_LOCATION:
      return action.customLocation.hash || '';
    default:
      return state;
  }
};

export const hashSelector = (state: GlobalState) => state.customLocation.hash;
