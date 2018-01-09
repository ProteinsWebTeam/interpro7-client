// @flow
import { NEW_PROCESSED_CUSTOM_LOCATION } from 'actions/types';

export default (state = {}, action) => {
  switch (action.type) {
    case NEW_PROCESSED_CUSTOM_LOCATION:
      return action.state || {};
    default:
      return state;
  }
};
