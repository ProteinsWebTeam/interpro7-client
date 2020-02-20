import { createSelector } from 'reselect';
import { format } from 'url';

import descriptionToPath from 'utils/processDescription/descriptionToPath';

import config from 'config';

const MULTIPLE_SLASHES = /([^:])\/{2,}/g;

export const cleanUpMultipleSlashes = (str = '') =>
  str.replace(MULTIPLE_SLASHES, '$1/');

export const getUrlForMeta = createSelector(
  state => state.settings.api,
  ({ protocol, hostname, port, root }) =>
    cleanUpMultipleSlashes(
      format({
        protocol,
        hostname,
        port,
        pathname: `${root}`,
      }),
    ),
);

export const getUrlForRelease = repoKey =>
  createSelector(
    () => config.github[repoKey],
    ({ owner, repo }) =>
      `https://api.github.com/repos/${owner}/${repo}/releases/latest`,
  );

export const getUrl = createSelector(
  // this one is just to memoize it
  key => key,
  key =>
    createSelector(
      state => state.settings[key],
      state => state.settings.navigation.pageSize,
      state => state.customLocation.description,
      state => state.customLocation.search,
      state => state.customLocation.hash,
      // eslint-disable-next-line
      (
        { protocol, hostname, port, root },
        settingsPageSize,
        description,
        search,
        hash,
      ) => {
        const _search =
          description.main.key && description[description.main.key].accession
            ? {}
            : { ...(search || {}) };
        if (
          !description[description.main.key].accession ||
          Object.values(description).find(
            ({ isFilter, db }) => isFilter && db,
          ) ||
          (description.entry && description.entry.memberDB)
        )
          _search.page_size = _search.page_size || settingsPageSize;

        if (hash === 'grid') {
          switch (description.main.key) {
            case 'entry':
              _search.extra_fields = 'description,literature,counters';
              break;
            case 'taxonomy':
              _search.extra_fields = 'lineage,counters';
              break;
            default:
              _search.extra_fields = 'counters';
              break;
          }
        }
        if (hash === 'table') {
          switch (description.main.key) {
            case 'taxonomy':
            case 'proteome':
            case 'set':
              _search.extra_fields = 'counters';
              break;
            default:
              break;
          }
        }

        // subpages will get the reverseURL, so its base dataLoader shold only get the accession payload
        const _description =
          description.main.key && description[description.main.key].accession
            ? {
                main: description.main,
                [description.main.key]: description[description.main.key],
              }
            : description;

        const cursor = _search.cursor;
        if (cursor) delete _search.cursor;

        const urlTmp = cleanUpMultipleSlashes(
          format({
            protocol,
            hostname,
            port,
            pathname: root + descriptionToPath(_description),
            query: _search,
          }),
        );
        // Cursors can have symbols that shouldn't be escaped
        if (cursor) {
          const sep = urlTmp.indexOf('?') === -1 ? '?' : '&';
          return `${urlTmp}${sep}cursor=${cursor}`;
        }
        return urlTmp;
      },
    ),
);

export const getReversedUrl = createSelector(
  state => state.settings.api,
  state => state.settings.navigation.pageSize,
  state => state.customLocation.description,
  state => state.customLocation.search,
  (
    { protocol, hostname, port, root },
    settingsPageSize,
    description,
    search,
  ) => {
    // copy of description, to modify it after
    const newDesc = {};
    let newMain;
    for (const [key, value] of Object.entries(description)) {
      newDesc[key] = key === 'other' ? [...value] : { ...value };
      if (value.isFilter && value.order === 1) {
        newMain = key;
        newDesc[key].isFilter = false;
      }
    }
    newDesc[description.main.key].isFilter = true;
    newDesc.main.key = newMain;
    let url = format({
      protocol,
      hostname,
      port,
      pathname: root + descriptionToPath(newDesc),
      query: {
        ...search,
        extra_fields: 'counters',
        page_size: search.page_size || settingsPageSize,
      },
    });
    if (description.main.key === 'entry' && newMain === 'taxonomy') {
      url = url.replace('/entry/', '/protein/entry/');
    }
    if (description.main.key === 'taxonomy' && newMain === 'proteome') {
      url = url.replace('/taxonomy/', '/protein/taxonomy/');
    }
    return url;
  },
);

export const getUrlForApi = (...parameters) =>
  getUrl('api')(...parameters)
    .replace('/alignments', '/')
    .replace('/logo', '/')
    .replace('/domain_architecture', '/')
    .replace('/interactions', '/')
    .replace('/sequence', '/')
    .replace('/genome3d', '/')
    .replace('/similar_proteins', '/');
