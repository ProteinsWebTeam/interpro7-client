// @flow
import { NEW_PROCESSED_CUSTOM_LOCATION } from 'actions/types';
import descriptionToDescription from 'utils/processDescription/descriptionToDescription';
import getEmptyDescription from 'utils/processDescription/emptyDescription';

/*:: import type { Description } from 'utils/processDescription/handlers'; */
/*:: import type { State } from 'reducers'; */

export default (
  state /*: Description */ = getEmptyDescription(),
  action /*: Object */,
) => {
  switch (action.type) {
    case NEW_PROCESSED_CUSTOM_LOCATION:
      return descriptionToDescription(action.customLocation.description);
    default:
      return state;
  }
};

export const descriptionSelector = (state /*: State */) =>
  state.customLocation.description;
