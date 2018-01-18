// @flow
import { createSelector } from 'reselect';
import { stringify as qsStringify } from 'query-string';

import descriptionToPath from 'utils/processDescription/descriptionToPath';

export const getUrl = createSelector(
  // this one is just to memoize it
  key => key,
  key =>
    createSelector(
      state => state.settings[key],
      state => state.settings.navigation.pageSize,
      state => state.customLocation.description,
      state => state.customLocation.search,
      (
        { protocol, hostname, port, root },
        settingsPageSize,
        description,
        search,
      ) => {
        const s =
          description.main.key && description[description.main.key].accession
            ? {}
            : { ...search } || {};
        if (
          !description[description.main.key].accession ||
          Object.values(description).find(
            ({ isFilter, db }) => isFilter && db,
          ) ||
          description.entry.memberDB
        )
          s.page_size = s.page_size || settingsPageSize;
        return `${protocol}//${hostname}:${port}${root}${descriptionToPath(
          description,
        )}?${qsStringify(s)}`.replace(/\?$/, '');
      },
    ),
);

export const getUrlForApi = getUrl('api');
