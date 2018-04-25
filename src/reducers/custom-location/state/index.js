// @flow
import { NEW_PROCESSED_CUSTOM_LOCATION } from 'actions/types';

/*:: export type LocationState = { [string]: any }; */
/*:: import type { State } from 'reducers'; */

export default (state /*: LocationState */ = {}, action /*: Object */) => {
  switch (action.type) {
    case NEW_PROCESSED_CUSTOM_LOCATION:
      return action.state || {};
    default:
      return state;
  }
};

export const locationStateSelector = (state /*: State */) =>
  state.customLocation.state;
