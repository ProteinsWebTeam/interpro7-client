/* eslint-env node */
import {DEV} from 'config';

export default (store/*: Store */) => {
  if (!(DEV && module && module.hot)) return;
  // If any change to the root reducer or its dependency tree
  module.hot.accept('reducers', () => {
    // Reloads the root reducer
    const nextReducer = require('reducers').default;
    // And replaces it in the store
    store.replaceReducer(nextReducer);
  });
};
