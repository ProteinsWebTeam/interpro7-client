import { createStore } from 'redux';

import rootReducer from 'reducers';
import settingsStorage from 'storage/settings';

import enhancer from 'store/enhancer';
import hmr from 'store/hmr';
import getInitialState from 'store/utils/get-initial-state';

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
  const store = createStore(
    rootReducer,
    getInitialState(history),
    enhancer(history),
  );
  if (settingsStorage) {
    settingsStorage.linkedStore = store;
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
