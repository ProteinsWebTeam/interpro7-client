// @flow
import * as runtime from 'offline-plugin/runtime';

import id from 'utils/cheap-unique-id';

import { addToast } from 'actions/creators';

/*:: import type Store from 'redux'; */

export default ({ dispatch } /*: Store */) => {
  runtime.install({
    onUpdating: () => {
      console.log('SW Event:', 'onUpdating');
    },
    onUpdateReady: () => {
      console.log('SW Event:', 'onUpdateReady');
      // Tells to new SW to take control immediately
      runtime.applyUpdate();
    },
    onUpdated: () => {
      console.log('SW Event:', 'onUpdated');
      // Reload the webpage to load into the new version if user wants it
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

    onUpdateFailed: () => {
      console.log('SW Event:', 'onUpdateFailed');
    },
  });
};
