import qs from 'query-string';

import { NEW_NEW_LOCATION } from 'actions/types';
import { newLocationChangeFromHistory } from 'actions/creators';
import processLocation from 'utils/location';
import path2description from 'utils/processLocation/path2description';
import description2path from 'utils/processLocation/description2path';

// Middleware to handle history change events
export default history => ({ dispatch }) => {
  // Dispatch new action only when history actually changes
  // Build new action from scratch
  history.listen(({ pathname, search, hash, state: _ }) => {
    dispatch(
      newLocationChangeFromHistory({
        description: path2description(pathname),
        search: qs.parse(search),
        hash,
      }),
    );
  });
  return next => action => {
    // if NEW_NEW_LOCATION don't process and update history, it'll eventually
    // result in another action being dispatched through callback
    if (action.type === NEW_NEW_LOCATION) {
      const { description, search, hash } = processLocation(action.location);
      const pathname = description2path(description);
      history[action.replace ? 'replace' : 'push']({
        pathname,
        search: qs.stringify(search),
        hash,
        state: description,
      });
      return;
    }

    // If anything but NEW_LOCATION, process normally
    // If anything but NEW_NEW_LOCATION, process normally
    next(action);
  };
};
