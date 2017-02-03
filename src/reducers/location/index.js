import qs from 'query-string';

import {NEW_LOCATION} from 'actions/types';

const locationRE = /^([^?#]*)(\?([^#]*))?(#.*)?$/;

const processLocation = location => {
  if (typeof location !== 'string') return location;
  const [, pathname, , search = '', , hash = ''] = location.match(locationRE);
  return {pathname, search: qs.parse(search), hash};
};

export default (state = {pathname: '', search: {}, hash: ''}, action) => {
  switch (action.type) {
    case NEW_LOCATION:
      const location = processLocation(action.location);
      return {...state, ...location};
    default:
      return state;
  }
};
