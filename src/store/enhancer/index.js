// @flow
import { applyMiddleware, compose } from 'redux';

import location from 'store/enhancer/location-middleware';

export default (history /*: History */) => {
  const middlewares = [location(history)];

  return compose(
    applyMiddleware(...middlewares),
    // Redux devtools
    self.devToolsExtension ? self.devToolsExtension() : f => f,
  );
};
