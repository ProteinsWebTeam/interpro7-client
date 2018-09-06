// @flow
/* global ga: false */
/*:: import type { Middleware } from 'redux'; */
/*:: import type history from 'history/createBrowserHistory'; */
/*:: declare var ga: (...args: Array<string>) => void; */
import { format } from 'url';
import { sleep } from 'timing-functions/src';

import { NEW_CUSTOM_LOCATION } from 'actions/types';
import { customLocationChangeFromHistory, addToast } from 'actions/creators';

import descriptionToPath from 'utils/processDescription/descriptionToPath';
import autoScroll from 'utils/auto-scroll';

// Middleware to handle history change events
const middleware = (history /*: history */) /*: Middleware<*, *, *> */ => ({
  dispatch,
  getState,
}) => {
  // Hook into history
  history.listen(
    // Dispatch new action only when history actually changes
    // Build new action from scratch
    async ({ state: { customLocation, state } }) => {
      await Promise.resolve();
      return dispatch(
        customLocationChangeFromHistory(customLocation, {
          ...customLocation.state,
          ...state,
        }),
      );
    },
  );

  // Analytics
  history.listen(() => {
    ga('set', 'location', window.location.href);
    ga('send', 'pageview');
  });

  const historyDispatch = ({ customLocation, replace, state }) => {
    const { from_interpro6: fromIP6, ...query } = customLocation.search || {};
    if (typeof fromIP6 !== 'undefined') {
      // eslint-disable-next-line no-magic-numbers
      sleep(1000).then(() => {
        dispatch(
          addToast(
            {
              title: 'Welcome on the new InterPro website 👋',
              body:
                'Explore the website and try our new features, but keep in mind that this is a ⚠️beta⚠️ and things can break. If they do, send us a ticket',
              link: {
                href: 'https://www.ebi.ac.uk/support/interpro',
                children: 'Click here to submit a ticket 📩',
              },
              ttl: 15000, // eslint-disable-line no-magic-numbers
            },
            'welcome_from_interpro6',
          ),
        );
      });
    }
    history[replace ? 'replace' : 'push']({
      pathname: descriptionToPath(customLocation.description),
      search: format({ query }),
      hash: customLocation.hash,
      state: { customLocation, state },
    });
  };

  // Just run once on startup
  historyDispatch({
    customLocation: getState().customLocation,
    replace: true,
    state: null,
  });
  autoScroll(history.location);

  // Hijack normal Redux flow
  return next => action => {
    // if NEW_CUSTOM_LOCATION don't process and update history, it will
    // eventually result in another NEW_PROCESSED_CUSTOM_LOCATION action being
    // dispatched through callback
    if (action.type === NEW_CUSTOM_LOCATION) {
      const previous = history.location;
      // update browser's location
      historyDispatch(action);
      autoScroll(history.location, previous);

      return;
    }

    // If anything but NEW_CUSTOM_LOCATION, process normally
    return next(action);
  };
};

export default middleware;
