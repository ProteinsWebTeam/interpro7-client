// @flow
import { createSelector } from 'reselect';

import { NEW_PROCESSED_CUSTOM_LOCATION } from 'actions/types';
import descriptionToDescription from 'utils/processDescription/descriptionToDescription';
import getEmptyDescription from 'utils/processDescription/emptyDescription';

/*:: import type { Description } from 'utils/processDescription/handlers'; */
/*:: import type { CustomLocation } from '..'; */
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

const descriptionLocationSelector = (customLocation /*: CustomLocation */) =>
  customLocation.description;

const mainKeyLocationSelector = createSelector(
  descriptionLocationSelector,
  description => description.main.key,
);

export const mainDBLocationSelector = createSelector(
  descriptionLocationSelector,
  mainKeyLocationSelector,
  (description, mainKey) => {
    if (!mainKey) return null;
    const mainType = description[mainKey];
    if (!mainType) return null;
    return mainType.db || null;
  },
);
