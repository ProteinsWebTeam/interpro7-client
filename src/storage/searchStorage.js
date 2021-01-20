// @flow
import Storage from 'utils/storage';

const THROTTLE_DELAY = 1000;
let storage;

try {
  storage = new Storage('search', 'local', THROTTLE_DELAY);
} catch (error) {
  // Don't subscribe persistent storage for settings
  console.error('Unable to create a persistent storage for the search terms');
  console.error(error);
}

export default storage;
