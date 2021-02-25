// @flow
import { Workbox, messageSW } from 'workbox-window';

import { sleep, schedule } from 'timing-functions';

import { addToast } from 'actions/creators';

// eslint-disable-next-line no-magic-numbers
const DELAY_BEFORE_CHECKING_NEW_VERSION = 1000 * 60 * 30; // 30 minutes

/*:: import type { Store } from 'redux'; */

const hasDynamicImport = () => {
  try {
    // eslint-disable-next-line no-new-func
    return new Function(
      "return import('data:text/javascript;base64,Cg==').then(r => true)",
    )();
  } catch (e) {
    return Promise.resolve(false);
  }
};

export default async ({ dispatch } /*: Store<*, *, *> */) => {
  if ('serviceWorker' in navigator) {
    const useModule = await hasDynamicImport();
    const wb = new Workbox(`sw.${useModule ? 'module' : 'legacy'}.js`);

    let registration;

    const showSkipWaitingPrompt = () => {
      dispatch(
        addToast(
          {
            title: 'New version ready',
            body: `A new version of this website is ready, reload this page to activate it.
              ⚠️ The website might not function correctly until updated.`,
            action: {
              text: 'Load new version',
              fn() {
                console.log('fn');
                if (registration && registration.waiting) {
                  messageSW(registration.waiting, { type: 'SKIP_WAITING' });
                }
              },
            },
          },
          'new-version-toast',
        ),
      );
    };

    wb.addEventListener('waiting', showSkipWaitingPrompt);
    wb.addEventListener('externalwaiting', showSkipWaitingPrompt);
    wb.addEventListener('controlling', () => window.location.reload());
    wb.addEventListener('activated', () => window.location.reload());

    wb.register().then((r) => (registration = r));

    // eslint-disable-next-line no-constant-condition
    while (true) {
      await sleep(DELAY_BEFORE_CHECKING_NEW_VERSION);
      await schedule();
      if (registration) registration.update();
    }
  }
};
