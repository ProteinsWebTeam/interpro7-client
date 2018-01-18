// @flow
import { applyMiddleware, compose } from 'redux';

import location from './location-middleware/index';
import jobs from './jobs-middleware';

export default (history /*: History */) => {
  const middlewares = [location(history), jobs];

  return compose(
    applyMiddleware(...middlewares),
    // Redux devtools
    self.devToolsExtension ? self.devToolsExtension() : f => f,
  );
};
