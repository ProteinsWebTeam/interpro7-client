// @flow
// $FlowFixMe
import { ADD_TOAST, REMOVE_TOAST, ToastAction } from 'actions/types';

const extractAllBut = (key: string) => ({
  from(source: ToastsState) {
    const { [key]: _, ...subset } = source;
    return subset as ToastsState;
  },
});

export default (state: ToastsState = {}, action: ToastAction) => {
  switch (action.type) {
    case ADD_TOAST:
      return { ...state, [action.id]: action.toast };
    case REMOVE_TOAST:
      return extractAllBut(action.id).from(state);
    default:
      return state;
  }
};
