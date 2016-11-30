import {ADD_TOAST, REMOVE_TOAST} from 'actions/types';

export default (state = {}, action) => {
  switch (action.type) {
    case ADD_TOAST:
      return {...state, [action.id]: action.toast};
    case REMOVE_TOAST:
      const {[action.id]: _, ...newState} = state;
      return newState;
    default:
      return state;
  }
};
