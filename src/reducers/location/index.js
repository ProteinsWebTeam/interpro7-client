import {combineReducers} from 'redux';
import {NEW_PROCESSED_LOCATION} from 'actions/types';

// export default (state = {pathname: '', search: {}, hash: ''}, action) => {
//   switch (action.type) {
//     case NEW_PROCESSED_LOCATION:
//       return {...state, ...action.location};
//     default:
//       return state;
//   }
// };

export const pathname = (state = '', action) => {
  switch (action.type) {
    case NEW_PROCESSED_LOCATION:
      return action.location.pathname;
    default:
      return state;
  }
};

export const search = (state = {}, action) => {
  switch (action.type) {
    case NEW_PROCESSED_LOCATION:
      return {...state, ...action.location.search};
    default:
      return state;
  }
};

export const hash = (state = '', action) => {
  switch (action.type) {
    case NEW_PROCESSED_LOCATION:
      return action.location.hash;
    default:
      return state;
  }
};

export default combineReducers({pathname, search, hash});
