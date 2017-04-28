import {createSelector} from 'reselect';

export const _SearchParamsToURL = search => search ?
  Object.entries(search)
    .reduce((acc, val) => acc + (val[1] ? `&${val[0]}=${val[1]}` : ''), '')
    .slice(1) : '';

export const getUrl = createSelector(// this one is just to memoize it
  key => key,
  key => createSelector(
    state => state.settings[key],
    state => state.settings.pagination,
    state => state.location,
    ({protocol, hostname, port, root}, pagination, {pathname, search}) => {
      const s = search || {};
      s.page_size = s.page_size || pagination.pageSize;
      return `${protocol}//${hostname}:${port}${root}${pathname}?${
        _SearchParamsToURL(s)
      }`;
    }
  )
);

export const getUrlForApi = getUrl('api');
