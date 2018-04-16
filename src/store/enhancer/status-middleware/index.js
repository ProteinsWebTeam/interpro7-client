import { format } from 'url';
import { schedule } from 'timing-functions/src';

import customFetch from 'utils/cached-fetch';

import { CHANGE_SETTINGS, RESET_SETTINGS } from 'actions/types';
import { serverStatus, browserStatus } from 'actions/creators';

const DEFAULT_SCHEDULE_DELAY = 2000; // 2 seconds
const DEFAULT_LOOP_TIMEOUT = 60000; // one minute

const checkStatus = async function*({
  status: { servers, browser },
  settings,
}) {
  // If we don't have a connection, no need to check for the servers,
  // we'll keep the last know values
  if (!browser) return;
  for (const endpoint of Object.keys(servers)) {
    const endpointSettings = settings[endpoint];
    const url = format({
      ...endpointSettings,
      pathname: endpointSettings.root,
    });
    try {
      const response = await customFetch(url, {
        method: 'HEAD',
        useCache: false,
      });
      yield serverStatus(endpoint, response.ok);
    } catch (_) {
      yield serverStatus(endpoint, false);
    }
  }
};

export default ({ dispatch, getState }) => {
  let loopID;
  let running = false;
  const loop = async () => {
    if (running) return;
    // This might have been called before the scheduled run, so clear the
    // corresponding scheduled run first
    clearTimeout(loopID);
    running = true;

    // Wait to have some time to do all the maintenance
    await schedule(DEFAULT_SCHEDULE_DELAY);

    try {
      for await (const action of checkStatus(getState())) {
        dispatch(action);
      }
    } catch (error) {
      console.error(error);
    } finally {
      loopID = setTimeout(loop, DEFAULT_LOOP_TIMEOUT);
      running = false;
    }
  };

  // start the logic
  running = loop();

  // Browser connection events
  window.addEventListener('online', () => dispatch(browserStatus(true)));
  window.addEventListener('offline', () => dispatch(browserStatus(false)));

  return next => action => {
    switch (action.type) {
      // In case settings changes, update the server statuses
      case CHANGE_SETTINGS:
      case RESET_SETTINGS:
        running = loop();
        break;
      default:
        break;
    }
    return next(action);
  };
};
