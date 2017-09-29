import { createSelector } from 'reselect';
import { stringify as qsStringify } from 'query-string';

import description2path from 'utils/processLocation/description2path';

export const getUrl = createSelector(
  // this one is just to memoize it
  key => key,
  key =>
    createSelector(
      state => state.settings[key],
      state => state.settings.pagination,
      state => state.newLocation.description,
      state => state.newLocation.search,
      ({ protocol, hostname, port, root }, pagination, description, search) => {
        const s = search || {};
        if (!description.mainAccession && !description.focusDB && !description.mainMemberDB)
          s.page_size = s.page_size || pagination.pageSize;
        return `${protocol}//${hostname}:${port}${root}${description2path(
          description
        )}?${qsStringify(s)}`.replace(/\?$/, '');
      }
    )
);

export const getUrlForApi = getUrl('api');
