/*:: import type { Middleware } from 'redux'; */
import { format } from 'url';
import { schedule } from 'timing-functions';

import customFetch from 'utils/cached-fetch';

// $FlowFixMe
import { CHANGE_SETTINGS, RESET_SETTINGS } from 'actions/types';
import { serverStatus, browserStatus } from 'actions/creators';

const DEFAULT_SCHEDULE_DELAY = 2000; // 2 seconds
const DEFAULT_LOOP_TIMEOUT = 60000; // one minute
const MAX_LOOP_TIMEOUT = 360000; // 10 minutes
const BACK_OFF_RATE = 1.5;

let loopTimeoutWithBackOff = DEFAULT_LOOP_TIMEOUT;

const checkStatusesAndDispatch = async function (
  { status: { servers, browser }, settings },
  dispatch,
) {
  // If we don't have a connection, no need to check for the servers,
  // we'll keep the last know values
  if (!browser) return;
  for (const endpoint of Object.keys(servers)) {
    const endpointSettings = settings[endpoint];

    let testEndPoint = '';
    switch (endpoint) {
      case 'alphafold':
        testEndPoint = 'api/prediction/Q5VSL9';
        break;
      case 'bfvd':
        testEndPoint = 'api/cluster/A0A2Z4HFS2';
        break;
      default:
    }

    let url = format({
      ...endpointSettings,
      pathname: endpointSettings.root + testEndPoint,
    });
    url = endpoint === 'wikipedia' ? `${url}?origin=*` : url;
    try {
      const response = await customFetch(url, {
        method: ['bfvd', 'alphafold', 'wikipedia'].includes(endpoint)
          ? 'GET'
          : 'HEAD',
        useCache: false,
      });
      dispatch(serverStatus(endpoint, response.ok));
    } catch {
      dispatch(serverStatus(endpoint, false));
      // Something bad happened, reduce the loop timeout
      loopTimeoutWithBackOff = DEFAULT_LOOP_TIMEOUT;
    }
  }
  // Increment the current loop timeout
  loopTimeoutWithBackOff = Math.min(
    MAX_LOOP_TIMEOUT,
    BACK_OFF_RATE * loopTimeoutWithBackOff,
  );
};

const middleware /*: Middleware<*, *, *> */ = ({ dispatch, getState }) => {
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
      checkStatusesAndDispatch(getState(), dispatch);
    } catch (error) {
      console.error(error);
    } finally {
      loopID = setTimeout(loop, loopTimeoutWithBackOff);
      running = false;
    }
  };

  // start the logic
  loop();

  // Browser connection events
  window.addEventListener('online', () => dispatch(browserStatus(true)));
  window.addEventListener('offline', () => dispatch(browserStatus(false)));

  return (next) => (action) => {
    switch (action.type) {
      // In case settings changes, update the server statuses
      case CHANGE_SETTINGS:
      case RESET_SETTINGS:
        loop();
        break;
      default:
        break;
    }
    return next(action);
  };
};

export default middleware;
