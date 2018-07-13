// @flow
import { createSelector } from 'reselect';

import { PROGRESS_DATA, UNLOAD_DATA } from 'actions/types';

/*:: export type DatumProgress = {
  progress: number,
  weight: number,
}; */
/*:: export type DataProgress = { [string]: DatumProgress }; */
/*:: import type { State } from 'reducers'; */

export default (state /*: DataProgress */ = {}, action /*: Object */) => {
  switch (action.type) {
    case PROGRESS_DATA:
      if (state[action.key] && state[action.key].progress === action.progress) {
        return state;
      }
      return {
        ...state,
        [action.key]: {
          progress: action.progress,
          weight: action.weight,
        },
      };
    case UNLOAD_DATA:
      const { [action.key]: _, ...newState } = state;
      return newState;
    default:
      return state;
  }
};

export const dataProgressSelector = (state /*: State */) => state.dataProgress;
export const overallDataProgressSelector = createSelector(
  dataProgressSelector,
  (dataProgress /*: DataProgress */) => {
    const keys = Object.keys(dataProgress);
    if (!keys.length) return 1;
    let overallProgress = 0;
    let overallWeight = 0;
    for (const url of keys) {
      const { progress, weight } = dataProgress[url];
      overallProgress += progress * weight;
      overallWeight += weight;
    }
    overallProgress /= overallWeight;
    return overallProgress;
  },
);
export const overallDataLoadingSelector = createSelector(
  overallDataProgressSelector,
  progress => progress !== 1,
);
