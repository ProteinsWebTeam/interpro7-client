import {createSelector} from 'reselect';
import description2path from 'utils/processLocation/description2path';

export const _SearchParamsToURL = search => search ?
  Object.entries(search)
    .reduce((acc, val) => acc + (val[1] ? `&${val[0]}=${val[1]}` : ''), '')
    .slice(1) : '';

export const getUrl = createSelector(// this one is just to memoize it
  key => key,
  key => createSelector(
    state => state.settings[key],
    state => state.settings.pagination,
    state => state.newLocation.description,
    state => state.newLocation.search,
    ({protocol, hostname, port, root}, pagination, description, search) => {
      const s = search || {};
      s.page_size = s.page_size || pagination.pageSize;
      return `${protocol}//${hostname}:${port}${root}${
        description2path(description)
      }?${_SearchParamsToURL(s)}`;
    }
  )
);

export const getUrlForApi = getUrl('api');
