import {NEW_PROCESSED_NEW_LOCATION} from 'actions/types';

const getDefaultState = () => ({
  other: null,
  mainType: null,
  mainDB: null,
  mainAccession: null,
  mainChain: null,
  mainMemberDB: null,
  mainMemberDBAccession: null,
  mainDetail: null,
  focusType: null,
  focusDB: null,
  focusAccession: null,
  focusChain: null,
  focusMemberDB: null,
  focusMemberDBAccession: null,
});

export default (state = getDefaultState(), action) => {
  switch (action.type) {
    case NEW_PROCESSED_NEW_LOCATION:
      return {...state, ...action.newLocation.description};
    default:
      return state;
  }
};
