/* global gtag: false */
/*:: declare var gtag: (str: string, str: string, obj: {}) => void; */
import { format } from 'url';

import { NEW_CUSTOM_LOCATION } from 'actions/types';
import { customLocationChangeFromHistory } from 'actions/creators';

import descriptionToPath from 'utils/processDescription/descriptionToPath';
import autoScroll from 'utils/auto-scroll';

// Middleware to handle history change events
const middleware =
  (
    historyWrapper /*: {history: any, basename: string} */,
  ) /*: Middleware<*, *, *> */ =>
  ({ dispatch, getState }) => {
    // Hook into history
    historyWrapper.history.listen(
      // Dispatch new action only when history actually changes
      // Build new action from scratch
      async ({ location } /*: {location: Location} */) => {
        if (!location?.state /*: any */?.customLocation) return;
        const { customLocation, state } = location.state /*: any */;
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
    historyWrapper.history.listen(() => {
      gtag('event', 'page_view', {
        event_label: window.location.href,
      });
    });

    const historyDispatch = ({ customLocation, replace, state }) => {
      const { from_interpro6: _, ...query } = customLocation?.search || {};
      // $FlowFixMe
      historyWrapper.history[replace ? 'replace' : 'push'](
        {
          pathname:
            historyWrapper.basename +
            descriptionToPath(customLocation.description),
          search: format({ query }),
          hash: customLocation.hash,
        },
        { customLocation, state },
      );
    };

    // Just run once on startup
    historyDispatch({
      customLocation: getState().customLocation,
      replace: true,
      state: null,
    });
    autoScroll(historyWrapper.history.location);

    // Hijack normal Redux flow
    return (next) => (action) => {
      // if NEW_CUSTOM_LOCATION don't process and update history, it will
      // eventually result in another NEW_PROCESSED_CUSTOM_LOCATION action being
      // dispatched through callback
      if (action.type === NEW_CUSTOM_LOCATION) {
        const previous = historyWrapper.history.location;
        // update browser's location
        historyDispatch(action);
        autoScroll(historyWrapper.history.location, previous);

        return;
      }

      // If anything but NEW_CUSTOM_LOCATION, process normally
      return next(action);
    };
  };

export default middleware;
