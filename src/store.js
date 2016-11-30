/* eslint-env node */
import {createStore, applyMiddleware, compose} from 'redux';
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

const getEnhancer = () => {
  const middlewares = [];

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

export default () => {
  const store = createStore(rootReducer, getEnhancer());
  if (settingsStorage) {
    settingsStorage.setLinkedStore(store);
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
