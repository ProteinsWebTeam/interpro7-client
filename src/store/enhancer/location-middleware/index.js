// @flow
import { format } from 'url';

// import config from 'config';

import { NEW_CUSTOM_LOCATION } from 'actions/types/index';
import { customLocationChangeFromHistory } from 'actions/creators/index';

import descriptionToPath from 'utils/processDescription/descriptionToPath/index';

// Middleware to handle history change events
export default history => ({ dispatch, getState }) => {
  // Hook into history
  history.listen(
    // Dispatch new action only when history actually changes
    // Build new action from scratch
    ({ state: { customLocation, state } }) =>
      dispatch(customLocationChangeFromHistory(customLocation, state)),
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

  // Hijack normal Redux flow
  return next => action => {
    // if NEW_CUSTOM_LOCATION don't process and update history, it will
    // eventually result in another action being dispatched through callback
    if (action.type === NEW_CUSTOM_LOCATION) {
      historyDispatch(action);
      return;
    }

    // If anything but NEW_LOCATION, process normally
    // If anything but NEW_CUSTOM_LOCATION, process normally
    return next(action);
  };
};
