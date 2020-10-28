// @flow
/*:: import type { Store } from 'redux'; */
/*:: import type { History } from 'history'; */
import { createStore } from 'redux';

import rootReducer from 'reducers';
import settingsStorage from 'storage/settings';

import getTableAccess, { FavEntries } from 'storage/idb';
import { setInitialFavourites } from 'actions/creators';

import enhancer from 'store/enhancer';
import hmr from 'store/hmr';
import getInitialState from 'store/utils/get-initial-state';

// Subscriber Generator
const persist = (
  store /*: Store<*, *, *> */,
  storage /*: typeof settingsStorage */,
) =>
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

export default (history /*: History<*> */) => {
  const store = createStore(
    rootReducer,
    getInitialState(history),
    enhancer(history),
  );
  // Dispatch action to set initial favourite entries stored in IndexedDB to Redux
  getTableAccess(FavEntries)
    .then((favT) => favT.getAll())
    .then((content) => Object.keys(content))
    .then((keys) => {
      store.dispatch(setInitialFavourites(keys));
    });

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
