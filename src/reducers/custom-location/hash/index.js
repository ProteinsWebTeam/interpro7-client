// @flow
import { NEW_PROCESSED_CUSTOM_LOCATION } from 'actions/types';

export default (state /*: Hash */ = '', action /*: Object */) => {
  switch (action.type) {
    case NEW_PROCESSED_CUSTOM_LOCATION:
      return action.customLocation.hash || '';
    default:
      return state;
  }
};

/*:: export type Hash = string; */

export const hashSelector = (state /*: { customLocation: { hash: Hash } } */) =>
  state.customLocation.hash;
