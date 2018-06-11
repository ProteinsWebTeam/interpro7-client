// @flow
/*:: import type { Middleware } from 'redux'; */
// $FlowIgnore
import DownloadWorker from 'web-workers/download';
import {
  DOWNLOAD_URL,
  DOWNLOAD_CANCEL,
  DOWNLOAD_PROGRESS,
  DOWNLOAD_ERROR,
  DOWNLOAD_SUCCESS,
  DOWNLOAD_DELETE,
} from 'actions/types';
import { downloadSelector } from 'reducers/download';

const messageHandler = dispatch => message => {
  const { data } = message;
  switch (data.type) {
    case DOWNLOAD_PROGRESS:
    case DOWNLOAD_ERROR:
    case DOWNLOAD_SUCCESS:
      dispatch(data);
      break;
    default:
      console.warn('not a recognised message', message);
  }
};

const middleware /*: Middleware */ = ({ dispatch, getState }) => {
  const worker = new DownloadWorker();
  worker.addEventListener('message', messageHandler(dispatch));

  return next => action => {
    switch (action.type) {
      case DOWNLOAD_URL:
      case DOWNLOAD_CANCEL:
        worker.postMessage(action);
        break;
      case DOWNLOAD_DELETE:
        // Clean up file reference
        URL.revokeObjectURL(
          downloadSelector(getState())[`${action.url}|${action.fileType}`]
            .blobURL || '',
        );
        break;
      default:
        break;
    }
    return next(action);
  };
};

export default middleware;
