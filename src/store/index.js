// @flow
import { createStore } from 'redux';
import { parse } from 'url';

import rootReducer from 'reducers';
import settingsStorage from 'storage/settings';
import pathToDescription from 'utils/processDescription/pathToDescription';

import enhancer from 'store/enhancer';
import hmr from 'store/hmr';

// Subscriber Generator
const persist = (store, storage) =>
  (() => {
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

const parseParamToNumber = param => search => {
  const { [param]: value, ...rest } = search;
  if (typeof value !== 'undefined') rest[param] = +value;
  return rest;
};

const getInitialState = history => {
  const { location: { pathname, search, hash } } = history;
  let settings;
  if (settingsStorage) {
    settings = settingsStorage.getValue() || undefined;
  }
  return {
    customLocation: {
      description: pathToDescription(pathname),
      search: parseParamToNumber('page_size')(
        parseParamToNumber('page')(parse(search, true).query),
      ),
      hash: hash.replace(/^#/, ''),
    },
    settings,
  };
};

export default history => {
  const store = createStore(
    rootReducer,
    getInitialState(history),
    enhancer(history),
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
  hmr(store);

  return store;
};
