import { createSelector } from 'reselect';

import { DataProgressAction, PROGRESS_DATA, UNLOAD_DATA } from 'actions/types';

export default (state: DataProgress = {}, action: DataProgressAction) => {
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

export const dataProgressSelector = (state: GlobalState) => state.dataProgress;
export const overallDataProgressSelector = createSelector(
  dataProgressSelector,
  (dataProgress) => {
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
  (progress) => progress !== 1,
);
