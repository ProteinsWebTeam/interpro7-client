// @flow
/*:: import type { Middleware } from 'redux'; */
// $FlowIgnore
import DownloadWorker from 'webWorkers/download';
import {
  DOWNLOAD_URL,
  DOWNLOAD_CANCEL,
  DOWNLOAD_PROGRESS,
  DOWNLOAD_ERROR,
  DOWNLOAD_SUCCESS,
} from 'actions/types';

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
  switch (data.type) {
    case DOWNLOAD_PROGRESS:
      return console.log(
        `${data.url} download: ${Math.floor(data.progress * 100)}%`,
      );
    case DOWNLOAD_ERROR:
      return console.log(`${data.url} download: errored!`);
    case DOWNLOAD_SUCCESS:
      return console.log(
        `${data.url} download: successful! (see ${data.blobURL})`,
      );
    default:
    //
  }
};

const middleware /*: Middleware */ = ({ dispatch, getState }) => {
  const worker = new DownloadWorker();
  worker.addEventListener('message', messageHandler(dispatch));
  // worker.addEventListener('message', m => console.log(m.data));

  return next => action => {
    switch (action.type) {
      case DOWNLOAD_URL:
      case DOWNLOAD_CANCEL:
        worker.postMessage(action);
    }
    return next(action);
  };
};

export default middleware;
