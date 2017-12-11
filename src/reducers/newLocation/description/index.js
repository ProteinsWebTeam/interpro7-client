import d2d from 'utils/processLocation/description2description';
import { NEW_PROCESSED_NEW_LOCATION } from 'actions/types';

export const getDefaultDescription = () => ({
  other: null,
  mainType: null,
  mainDB: null,
  mainIntegration: null,
  mainAccession: null,
  mainChain: null,
  mainMemberDB: null,
  mainMemberDBAccession: null,
  mainDetail: null,
  focusType: null,
  focusDB: null,
  focusIntegration: null,
  focusAccession: null,
  focusChain: null,
  focusMemberDB: null,
  focusMemberDBAccession: null,
});

export default (state = getDefaultDescription(), action) => {
  switch (action.type) {
    case NEW_PROCESSED_NEW_LOCATION:
      return d2d(action.newLocation.description);
    default:
      return state;
  }
};
