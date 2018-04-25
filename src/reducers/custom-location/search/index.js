// @flow
import { NEW_PROCESSED_CUSTOM_LOCATION } from 'actions/types';

/*:: export type Search = {
  page?: number,
  page_size?: number,
  [string]: string,
}; */
/*:: import type { State } from 'reducers'; */

export default (state /*: Search */ = {}, action /*: Object */) => {
  switch (action.type) {
    case NEW_PROCESSED_CUSTOM_LOCATION:
      return action.customLocation.search || {};
    default:
      return state;
  }
};

export const searchSelector = (state /*: State */) =>
  state.customLocation.search;
