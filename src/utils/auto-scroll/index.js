// @flow
import { schedule, sleep } from 'timing-functions/src';

const RETRY_DELAY = 100;

const autoScroll = async (
  current /*: Location */,
  previous /*:: ?: Location */,
  isRetry /*:: ?: boolean */,
) => {
  await schedule();
  if (!previous || previous.pathname !== current.pathname) {
    window.scrollTo(0, 0);
  }
  if (current.hash) {
    const target = document.querySelector(current.hash);
    if (target) {
      window.scrollTo(target.getBoundingClientRect());
      target.focus();
    } else {
      // Might not have been mounted yet, wait a bit and retry, only once
      if (!isRetry) {
        await sleep(RETRY_DELAY);
        autoScroll(current, previous, true);
      }
    }
  }
};

export default autoScroll;
