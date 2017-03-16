// @flow
import {LOADING_DATA, LOADED_DATA, FAILED_LOADING_DATA, UNLOADING_DATA}
  from 'actions/types';

/*:: type Datum = {
  payload: any,
  loading: boolean,
  error: any,
} */

export default (
  state/*: {[key: string]: Datum} */ = {}, action/*: Object */
) => {
  switch (action.type) {
    case LOADING_DATA:
      return {...state, [action.key]: {loading: true}};
    case LOADED_DATA:
      return {
        ...state,
        [action.key]: {
          ...state[action.key],
          loading: false,
          payload: action.payload,
          status: action.status,
        },
      };
    case FAILED_LOADING_DATA:
      return {
        ...state,
        [action.key]: {
          ...state[action.key],
          loading: false,
          error: action.error,
        },
      };
    // eslint-disable-next-line no-case-declarations
    case UNLOADING_DATA:
      const {[action.key]: _, ...newState} = state;
      return newState;
    default:
      return state;
  }
};
