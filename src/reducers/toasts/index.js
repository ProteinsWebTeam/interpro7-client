// @flow
import {ADD_TOAST, REMOVE_TOAST} from 'actions/types';

const extractAllBut = key => ({
  from(source) {
    const {[key]: _, ...subset} = source;
    return subset;
  },
});

export default (state/*: Object */ = {}, action/*: Object */) => {
  switch (action.type) {
    case ADD_TOAST:
      return {...state, [action.id]: action.toast};
    case REMOVE_TOAST:
      return extractAllBut(action.id).from(state);
    default:
      return state;
  }
};
