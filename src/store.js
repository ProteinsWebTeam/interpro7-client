/* eslint-env node */
import {createStore, applyMiddleware, compose} from 'redux';
import qs from 'query-string';

import rootReducer from 'reducers';
import settingsStorage from 'storage/settings';
import {DEV} from 'config';

// Subscriber Generator
const persist = (store, storage) => (() => {
  let settings;
  // Subscriber
  return () => {
    const newSettings = store.getState().settings;
    if (settings === newSettings) return;
    settings = newSettings;

    // Async!
    storage.setValue(settings);
  };
})();

const historyMW = history => ({getState}) => next => action => {
  const output = next(action);
  const {pathname, search, hash} = getState().location;
  if (action.type === 'NEW_LOCATION') {
    history.push({pathname, search: qs.stringify(search), hash});
  }
  console.log(output);
};

const getEnhancer = history => {
  const middlewares = [historyMW(history)];

  return compose(
    applyMiddleware(...middlewares),
    self.devToolsExtension ? self.devToolsExtension() : f => f
  );
};

const hmr = store => {
  // If any change to the root reducer or its dependency tree
  module.hot.accept('reducers', () => {
    // Reloads the root reducer
    const nextReducer = require('reducers').default;
    // And replaces it in the store
    store.replaceReducer(nextReducer);
  });
};

export default history => {
  const {location: {pathname, search, hash}} = history;
  const store = createStore(
    rootReducer,
    {location: {pathname, search: qs.parse(search), hash}},
    getEnhancer(history)
  );
  if (settingsStorage) {
    // settingsStorage.setLinkedStore(store);
    const persistSubscriber = persist(store, settingsStorage);
    // Run it once at startup
    persistSubscriber();
    // And then subscribe to the store
    store.subscribe(persistSubscriber);
  }

  // This block enables HMR for the reducers if needed
  if (DEV && module.hot) hmr(store);

  return store;
};
