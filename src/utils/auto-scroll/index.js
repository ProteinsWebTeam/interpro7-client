// @flow
/*:: import type { Location } from 'history'; */

import { schedule, sleep } from 'timing-functions';

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
    let target;
    try {
      target = document.querySelector(current.hash);
    } catch {
      /**/
    }
    if (target) {
      const targetTmp = target;
      window.scrollTo(targetTmp.getBoundingClientRect());
      targetTmp.focus();
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
