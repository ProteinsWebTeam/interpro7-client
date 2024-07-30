import { createSelector } from 'reselect';

import { NEW_PROCESSED_CUSTOM_LOCATION } from 'actions/types';
import descriptionToDescription from 'utils/processDescription/descriptionToDescription';
import getEmptyDescription from 'utils/processDescription/emptyDescription';
import { Action } from 'redux';

interface LocationAction extends Action {
  customLocation: InterProPartialLocation;
}
export default (
  state: InterProDescription = getEmptyDescription(),
  action: LocationAction,
) => {
  switch (action.type) {
    case NEW_PROCESSED_CUSTOM_LOCATION:
      return descriptionToDescription(action.customLocation.description);
    default:
      return state;
  }
};

export const descriptionSelector = (state: GlobalState) =>
  state.customLocation.description;

const descriptionLocationSelector = (customLocation: InterProLocation) =>
  customLocation.description;

const mainKeyLocationSelector = createSelector(
  descriptionLocationSelector,
  (description) => description.main.key,
);

export const mainDBLocationSelector = createSelector(
  descriptionLocationSelector,
  mainKeyLocationSelector,
  (description, mainKey) => {
    if (!mainKey) return null;
    const mainType = description[mainKey as Endpoint];
    if (!mainType) return null;
    return mainType.db || (mainType as EntryLocation).memberDB || null;
  },
);
