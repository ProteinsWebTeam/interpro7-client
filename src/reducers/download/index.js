// @flow
import {
  DOWNLOAD_URL,
  DOWNLOAD_PROGRESS,
  DOWNLOAD_SUCCESS,
  DOWNLOAD_DELETE,
  DOWNLOAD_ERROR,
} from 'actions/types';

/*:: export type DatumProgress = {
  progress: number,
  successful: ?boolean,
  blobURL: ?string,
}; */
/*:: export type Download = { [string]: DatumProgress }; */
/*:: import type { State } from 'reducers'; */

const keyFromAction = action =>
  [action.url, action.fileType, action.subset && 'subset']
    .filter(Boolean)
    .join('|');

export default (state /*: Download */ = {}, action /*: Object */) => {
  switch (action.type) {
    case DOWNLOAD_URL:
    case DOWNLOAD_PROGRESS:
      if (
        state[keyFromAction(action)] &&
        state[keyFromAction(action)].progress === action.progress
      ) {
        return state;
      }
      return {
        ...state,
        [keyFromAction(action)]: {
          progress: action.progress || 0,
          successful: null,
          blobURL: null,
          size: null,
        },
      };
    case DOWNLOAD_ERROR:
    case DOWNLOAD_SUCCESS:
      return {
        ...state,
        [keyFromAction(action)]: {
          progress: action.progress || 1,
          successful: action.type === DOWNLOAD_SUCCESS,
          blobURL: action.blobURL,
          size: action.size,
        },
      };
    case DOWNLOAD_DELETE:
      const { [keyFromAction(action)]: _, ...newState } = state;
      return newState;
    default:
      return state;
  }
};

export const downloadSelector = (state /*: State */) => state.download;
