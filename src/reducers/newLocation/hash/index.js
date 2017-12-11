import {NEW_PROCESSED_NEW_LOCATION} from 'actions/types';

const getDefaultState = () => '';

export default (state = getDefaultState(), action) => {
  switch (action.type) {
    case NEW_PROCESSED_NEW_LOCATION:
      return action.newLocation.hash || getDefaultState();
    default:
      return state;
  }
};
