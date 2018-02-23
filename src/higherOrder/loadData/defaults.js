import { createSelector } from 'reselect';
import { format } from 'url';

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
        const _search =
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
          _search.page_size = _search.page_size || settingsPageSize;
        return format({
          protocol,
          hostname,
          port,
          pathname: root + descriptionToPath(description),
          query: _search,
        });
      },
    ),
);

export const getUrlForApi = getUrl('api');
