import qs from 'query-string';

import config from 'config';

import { NEW_NEW_LOCATION, NEW_CUSTOM_LOCATION } from 'actions/types';
import {
  newLocationChangeFromHistory,
  customLocationChangeFromHistory,
} from 'actions/creators';
import processLocation from 'utils/location';
import path2description from 'utils/processLocation/path2description';
import description2path from 'utils/processLocation/description2path';
import pathToDescription from 'utils/processDescription/pathToDescription';
import descriptionToPath from 'utils/processDescription/descriptionToPath';

const pageAsNumber = value => {
  const _value = +value;
  if (!value || isNaN(_value)) {
    return 1;
  }
  return _value;
};

const pageSizeAsNumber = value => {
  const _value = +value;
  if (!value || isNaN(_value)) {
    return config.pagination.pageSize;
  }
  return _value;
};

// Middleware to handle history change events
export default history => ({ dispatch }) => {
  // Dispatch new action only when history actually changes
  // Build new action from scratch
  history.listen(({ pathname, search, hash, state: _ }) => {
    const _search = qs.parse(search);
    if (_search.page !== undefined) _search.page = pageAsNumber(_search.page);
    if (_search.pageSize !== undefined) {
      _search.pageSize = pageSizeAsNumber(_search.pageSize);
    }
    dispatch(
      customLocationChangeFromHistory({
        description: pathToDescription(pathname),
        search: _search,
        hash,
      }),
    );
    dispatch(
      newLocationChangeFromHistory({
        description: path2description(pathname),
        search: _search,
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
    if (action.type === NEW_CUSTOM_LOCATION) {
      const { description, search, hash } = processLocation(action.location);
      const pathname = descriptionToPath(description);
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
