import qs from 'query-string';

// import config from 'config';

import { NEW_CUSTOM_LOCATION } from 'actions/types';
import { customLocationChangeFromHistory } from 'actions/creators';

import descriptionToPath from 'utils/processDescription/descriptionToPath';

// Middleware to handle history change events
export default history => store => {
  // Hook into history
  history.listen(
    // Dispatch new action only when history actually changes
    // Build new action from scratch
    ({ state: { customLocation, state } }) =>
      store.dispatch(customLocationChangeFromHistory(customLocation, state)),
  );

  const historyDispatch = ({ customLocation, replace, state }) =>
    history[replace ? 'replace' : 'push']({
      pathname: descriptionToPath(customLocation.description),
      search: qs.stringify(customLocation.search),
      hash: customLocation.hash,
      state: { customLocation, state },
    });

  let firstTime = true;

  // Hijack normal Redux flow
  return next => action => {
    if (firstTime) {
      firstTime = false;
      historyDispatch({
        customLocation: store.getState().customLocation,
        replace: true,
      });
    }

    // if NEW_CUSTOM_LOCATION don't process and update history, it will
    // eventually result in another action being dispatched through callback
    if (action.type === NEW_CUSTOM_LOCATION) {
      historyDispatch(action);
      return;
    }

    // If anything but NEW_LOCATION, process normally
    // If anything but NEW_CUSTOM_LOCATION, process normally
    next(action);
  };
};
