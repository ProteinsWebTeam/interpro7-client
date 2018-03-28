// @flow
import { createSelector } from 'reselect';

import {
  LOADING_DATA,
  LOADED_DATA,
  PROGRESS_DATA,
  FAILED_LOADING_DATA,
  UNLOADING_DATA,
} from 'actions/types';

/*:: export type Datum = {
  payload: any,
  loading: boolean,
  url: string,
  progress: number,
  error: any,
} */
/*:: export type Data = { [string]: Datum } */
/*:: import type { State } from 'reducers'; */

export const alreadyLoadingError = 'Already Loading';

export default (state /*: Data */ = {}, action /*: Object */) => {
  switch (action.type) {
    case LOADING_DATA:
      if (state[action.key]) throw new Error(alreadyLoadingError);
      return {
        ...state,
        [action.key]: { loading: true, progress: 0, url: action.key },
      };
    case LOADED_DATA:
      return {
        ...state,
        [action.key]: {
          ...state[action.key],
          loading: false,
          payload: action.payload,
          status: action.status,
          ok: action.ok,
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
          ok: false,
          progress: 1,
        },
      };
    case UNLOADING_DATA: // eslint-disable-line no-case-declarations
      const { [action.key]: _, ...newState } = state;
      return newState;
    default:
      return state;
  }
};

export const dataSelector = (state /*: State */) => state.data;
export const dataLoadingSelector = createSelector(dataSelector, (
  data /*: Data */,
) =>
  Object.values(data).some(datum => {
    if (datum && typeof datum === 'object') {
      return datum.loading;
    }
    return false;
  }),
);
export const dataProgressSelector = createSelector(dataSelector, (
  data /*: Data */,
) => {
  let progress = 0;
  const urls = Object.keys(data);
  for (const url of urls) {
    const datum = data[url];
    progress += 1 / (datum.loading ? 2 : 1) + datum.progress;
  }
  progress /= 2 * urls.length;
  return isNaN(progress) ? 1 : progress;
});
