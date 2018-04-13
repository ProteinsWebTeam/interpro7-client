import { format } from 'url';
import { schedule } from 'timing-functions/src';

const DEFAULT_SCHEDULE_DELAY = 2000; // 2 seconds
const DEFAULT_LOOP_TIMEOUT = 60000; // one minute

const checkStatus = async ({ status: { servers }, settings }) => {
  for (const endpoint of Object.keys(servers)) {
    const endpointSettings = settings[endpoint];
    const url = format({
      ...endpointSettings,
      pathname: endpointSettings.root,
    });
    console.log(url);
  }
};

export default ({ getState }) => {
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
      checkStatus(getState());
    } catch (error) {
      console.error(error);
    } finally {
      loopID = setTimeout(loop, DEFAULT_LOOP_TIMEOUT);
      running = false;
    }
  };

  // start the logic
  running = loop();

  return next => action => next(action);
};
