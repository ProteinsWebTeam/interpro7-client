// @flow
/*:: import type { BrowserHistory } from 'history'; */

import { applyMiddleware, compose } from 'redux';

import jobs from './jobs-middleware';
import location from './location-middleware';
import status from './status-middleware';
import download from './download-middleware';

export default (
  history /*: {history: BrowserHistory, basename: string} */,
) /*: (any) => any */ => {
  const middlewares = [jobs, location(history), status, download];

  return compose(
    applyMiddleware(...middlewares),
    // Redux devtools
    self.__REDUX_DEVTOOLS_EXTENSION__
      ? self.__REDUX_DEVTOOLS_EXTENSION__()
      : (f) => f,
  );
};
