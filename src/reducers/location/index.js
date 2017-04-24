import {NEW_PROCESSED_LOCATION} from 'actions/types';

export default (state = {pathname: '', search: {}, hash: ''}, action) => {
  switch (action.type) {
    case NEW_PROCESSED_LOCATION:
      return {...state, ...action.location};
    default:
      return state;
  }
};
