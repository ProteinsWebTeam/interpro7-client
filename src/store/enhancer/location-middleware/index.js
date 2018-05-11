import { format } from 'url';

import analytics from 'utils/analytics';

import { NEW_CUSTOM_LOCATION } from 'actions/types';
import { customLocationChangeFromHistory } from 'actions/creators';

import descriptionToPath from 'utils/processDescription/descriptionToPath';
import autoScroll from 'utils/auto-scroll';

// Middleware to handle history change events
export default history => ({ dispatch, getState }) => {
  // Hook into history
  history.listen(
    // Dispatch new action only when history actually changes
    // Build new action from scratch
    async ({ state: { customLocation, state } }) => {
      await Promise.resolve();
      return dispatch(customLocationChangeFromHistory(customLocation, state));
    },
  );

  let previous;
  history.listen(
    // Analytics
    (_, action) => {
      const current = window.location.href;
      analytics.send('navigation', { from: previous, to: current, action });
      previous = current;
    },
  );

  const historyDispatch = ({ customLocation, replace, state }) =>
    history[replace ? 'replace' : 'push']({
      pathname: descriptionToPath(customLocation.description),
      search: format({ query: customLocation.search }),
      hash: customLocation.hash,
      state: { customLocation, state },
    });

  // Just run once on startup
  historyDispatch({
    customLocation: getState().customLocation,
    replace: true,
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
