/* eslint-env node */
import {createStore, applyMiddleware, compose} from 'redux';
import qs from 'query-string';

import rootReducer from 'reducers';
import settingsStorage from 'storage/settings';
import {DEV} from 'config';
import {NEW_LOCATION} from 'actions/types';
import {
  locationChangeFromHistory,
  newLocationChangeFromHistory,
} from 'actions/creators';
import processLocation from 'utils/location';
import path2description from 'utils/processLocation/path2description';
import description2path from 'utils/processLocation/description2path';

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

// Middleware to handle history change events
const historyMW = history => ({dispatch}) => {
  // Dispatch new action only when history actually changes
  // Build new action from scratch
  history.listen(({pathname, search, hash}) => {
    dispatch(
      locationChangeFromHistory({pathname, search: qs.parse(search), hash})
    );
    console.log(pathname);
    console.log(description2path(path2description(pathname)));
    dispatch(
      newLocationChangeFromHistory({
        description: path2description(pathname),
        search: qs.parse(search),
        hash,
      })
    );
  });
  return next => action => {
    // If anything but NEW_LOCATION, process normally
    if (action.type !== NEW_LOCATION) {
      next(action);// next() returns action
      return;
    }
    // Otherwise, don't process and update history, it'll eventually
    // result in another action being dispatched through callback
    const {pathname, search, hash} = processLocation(action.location);
    history.push({pathname, search: qs.stringify(search), hash});
  };
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
    {
      location: {pathname, search: qs.parse(search), hash},
      newLocation: {
        description: path2description(pathname),
        search: qs.parse(search),
        hash,
      },
    },
    getEnhancer(history)
  );
  window.getState = store.getState.bind(store);// TODO: remove, only for debug
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
