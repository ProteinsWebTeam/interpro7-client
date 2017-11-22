// @flow
import Storage from 'utils/storage';
import { resetSettings } from 'actions/creators';

const THROTTLE_DELAY = 1000;
let storage;

try {
  storage = new Storage('settings', 'local', THROTTLE_DELAY);
} catch (error) {
  // Don't subscribe persistant storage for settings
  console.error('Unable to create a presistent storage for the settings');
  console.error(error);
}

if (self.addEventListener) {
  self.addEventListener('storage', event => {
    if (event.storageArea !== storage._engine) return;
    if (event.key !== storage._internalNamespace) return;
    // An other tab changed the key this storage manager is handling
    // Update it to keep in sync
    storage._currentValue = JSON.parse(event.newValue);
    // Start an event in redux to keep redux state in sync
    storage._linkedStore.dispatch(resetSettings(storage._currentValue));
  });
}

export default storage;
