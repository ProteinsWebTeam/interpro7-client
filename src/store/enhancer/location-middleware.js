import qs from 'query-string';

import {NEW_LOCATION} from 'actions/types';
import {
  locationChangeFromHistory,
  newLocationChangeFromHistory,
} from 'actions/creators';
import processLocation from 'utils/location';
import path2description from 'utils/processLocation/path2description';
import description2path from 'utils/processLocation/description2path';

// Middleware to handle history change events
export default history => ({dispatch}) => {
  // Dispatch new action only when history actually changes
  // Build new action from scratch
  history.listen(({pathname, search, hash}) => {
    dispatch(
      locationChangeFromHistory({pathname, search: qs.parse(search), hash})
    );
    console.log(pathname);
    console.log(description2path(path2description(pathname)));
    dispatch(
      newLocationChangeFromHistory({
        description: path2description(pathname),
        search: qs.parse(search),
        hash,
      })
    );
  });
  return next => action => {
    // If anything but NEW_LOCATION, process normally
    if (action.type !== NEW_LOCATION) {
      next(action);// next() returns action
      return;
    }
    // Otherwise, don't process and update history, it'll eventually
    // result in another action being dispatched through callback
    const {pathname, search, hash} = processLocation(action.location);
    history[action.replace ? 'replace' : 'push']({
      pathname,
      search: qs.stringify(search),
      hash,
    });
  };
};
