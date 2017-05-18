// @flow
import {
  LOADING_DATA, LOADED_DATA, PROGRESS_DATA,
  FAILED_LOADING_DATA, UNLOADING_DATA,
} from 'actions/types';

/*:: type Datum = {
  payload: any,
  loading: boolean,
  progress: number,
  error: any,
} */

export const alreadyLoadingError = 'Already Loading';

export default (
  state/*: {[key: string]: Datum} */ = {}, action/*: Object */
) => {
  switch (action.type) {
    case LOADING_DATA:
      if (state[action.key]) throw new Error(alreadyLoadingError);
      return {...state, [action.key]: {loading: true, progress: 0}};
    case LOADED_DATA:
      return {
        ...state,
        [action.key]: {
          ...state[action.key],
          loading: false,
          payload: action.payload,
          status: action.status,
          progress: 1,
        },
      };
    case PROGRESS_DATA:
      return {
        ...state,
        [action.key]: {
          ...state[action.key],
          progress: action.progress,
        },
      };
    case FAILED_LOADING_DATA:
      return {
        ...state,
        [action.key]: {
          ...state[action.key],
          loading: false,
          error: action.error,
          progress: 1,
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
