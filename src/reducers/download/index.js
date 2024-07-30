import {
  DOWNLOAD_URL,
  DOWNLOAD_PROGRESS,
  DOWNLOAD_SUCCESS,
  DOWNLOAD_DELETE,
  DOWNLOAD_ERROR,
  SET_INITIAL_DOWNLOADS,
  // $FlowFixMe
} from 'actions/types';
import { createNotification } from 'utils/browser-notifications';
import getTableAccess, { DownloadJobs } from 'storage/idb';

const downloadsTable = getTableAccess(DownloadJobs);

const deleteDownloadInDB = async (key) => {
  const downloadsT = await downloadsTable;
  downloadsT.delete(key);
};

/*::
export type DatumProgress = {
  progress: number,
  successful: ?boolean,
  blobURL: ?string,
};
export type CompletedDownload ={
  blob: Blob,
  date: Date,
  fileType: string,
  version: string,
  length: number,
  subset: boolean,
}

*/
/*:: export type Download = { [string]: DatumProgress }; */
/*:: import type { State } from 'reducers'; */

const keyFromAction = (action) =>
  action.key ||
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
      const text =
        action.type === 'DOWNLOAD_SUCCESS'
          ? 'Your files are ready to download'
          : 'There has been an error generating the file';
      // const notification =
      createNotification('InterPro', text);
      // notification.onclick = () => {
      //   window.location.href = `${window.location.origin}/interpro/result/download`;
      // };
      return {
        ...state,
        [keyFromAction(action)]: {
          progress: action.progress || 1,
          successful: action.type === DOWNLOAD_SUCCESS,
          blobURL: action.blob ? URL.createObjectURL(action.blob) : null,
          size: action.blob?.size,
          length: action.length,
          subset: action.subset,
          date: action.date,
          version: action.version,
          fileType: action.fileType,
        },
      };
    case DOWNLOAD_DELETE:
      const key = keyFromAction(action);
      const { [key]: _, ...newState } = state;
      deleteDownloadInDB(key);
      return newState;
    case SET_INITIAL_DOWNLOADS:
      const savedDownloads = {};
      // prettier-ignore
      (Object.entries(action.downloads) /*: any */)
        .forEach(
          ([
            key,
            { blob, date, fileType, length, subset, version },
          ]/*: [string, CompletedDownload] */) => {
            savedDownloads[key] = {
              progress: 1,
              successful: true,
              blobURL: URL.createObjectURL(blob),
              size: blob.size,
              length,
              subset,
              fileType,
              date,
              version,
            };
          },
        );
      return {
        ...state,
        ...savedDownloads,
      };
    default:
      return state;
  }
};

export const downloadSelector = (state /*: State */) => state.download;
