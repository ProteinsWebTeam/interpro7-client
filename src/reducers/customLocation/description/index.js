import { NEW_PROCESSED_CUSTOM_LOCATION } from 'actions/types';
import descriptionToDescription from 'utils/processDescription/descriptionToDescription';
import getEmptyDescription from 'utils/processDescription/emptyDescription';

export default (state = getEmptyDescription(), action) => {
  switch (action.type) {
    case NEW_PROCESSED_CUSTOM_LOCATION:
      return descriptionToDescription(action.customLocation.description);
    default:
      return state;
  }
};
