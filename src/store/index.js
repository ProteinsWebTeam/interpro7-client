import { createStore } from 'redux';
import qs from 'query-string';

import rootReducer from 'reducers';
import settingsStorage from 'storage/settings';
import path2description from 'utils/processLocation/path2description';

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

export default history => {
  const { location: { pathname, search, hash } } = history;
  const store = createStore(
    rootReducer,
    {
      newLocation: {
        description: path2description(pathname),
        search: qs.parse(search),
        hash,
      },
    },
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
