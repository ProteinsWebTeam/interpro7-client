import { format } from 'url';
import { schedule, sleep } from 'timing-functions/src';

import customFetch from 'utils/cached-fetch';

import { serverStatus, browserStatus } from 'actions/creators';

const DEFAULT_SCHEDULE_DELAY = 2000; // 2 seconds
const DEFAULT_LOOP_TIMEOUT = 60000; // one minute

async function* checkStatus({ status: { servers, browser }, settings }) {
  // If we don't have a connection, no need to check for the servers,
  // we'll keep the last know values
  if (!browser) return;
  for (const endpoint of Object.keys(servers)) {
    const endpointSettings = settings[endpoint];
    let url = format({
      ...endpointSettings,
      pathname: endpointSettings.root,
    });
    if (Math.random() > 0.75) {
      url += '/jkjljlkjkl/';
    }
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
}

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
      loopID = setTimeout(loop, DEFAULT_LOOP_TIMEOUT / 10);
      running = false;
    }
  };

  // start the logic
  running = loop();

  window.addEventListener('online', () => {
    dispatch(browserStatus(true));
  });

  window.addEventListener('offline', () => {
    dispatch(browserStatus(false));
  });

  return next => action => next(action);
};
