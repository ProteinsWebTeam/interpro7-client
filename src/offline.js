// @flow
import * as runtime from 'offline-plugin/runtime';
import { sleep, schedule } from 'timing-functions/src';

import id from 'utils/cheap-unique-id';

import { addToast } from 'actions/creators';

// eslint-disable-next-line no-magic-numbers
const DELAY_BEFORE_CHECKING_NEW_VERSION = 1000 * 60 * 30; // 30 minutes
const DELAY_BEFORE_UNSAFE_TO_RELOAD = 2 * 1000; // 2 seconds

/*:: import type Store from 'redux'; */

export default async ({ dispatch } /*: Store */) => {
  let safeToReload = true;

  runtime.install({
    onInstalled() {
      console.log('SW Event:', 'onInstalled');
    },
    onUpdating() {
      console.log('SW Event:', 'onUpdating');
    },
    onUpdateReady() {
      console.log('SW Event:', 'onUpdateReady');
      // Tells to new SW to take control immediately
      runtime.applyUpdate();
    },
    onUpdated() {
      console.log('SW Event:', 'onUpdated');
      // If we are within a small timeframe after the page has loaded
      if (safeToReload) {
        // Just reload the page directly
        return window.location.reload();
      }
      // Reload the page to load the new version only if user wants it
      dispatch(
        addToast(
          {
            title: 'New version ready',
            body:
              'A new version of this website is ready, reload this page now to use it',
            action: {
              text: 'Load new version',
              fn() {
                window.location.reload();
              },
            },
          },
          id(),
        ),
      );
    },
    onUpdateFailed() {
      console.log('SW Event:', 'onUpdateFailed');
    },
  });

  await sleep(DELAY_BEFORE_UNSAFE_TO_RELOAD);
  safeToReload = false;

  // Infinite loop to check if new version available every once in a while
  // eslint-disable-next-line no-constant-condition
  while (true) {
    await sleep(DELAY_BEFORE_CHECKING_NEW_VERSION);
    await schedule();
    runtime.update();
  }
};
