// @flow
import { applyMiddleware, compose } from 'redux';

import jobs from './jobs-middleware';
import location from './location-middleware';
import status from './status-middleware';
import download from './download-middleware';

export default (history /*: History */) => {
  const middlewares = [jobs, location(history), status, download];

  return compose(
    applyMiddleware(...middlewares),
    // Redux devtools
    self.devToolsExtension ? self.devToolsExtension() : f => f,
  );
};
