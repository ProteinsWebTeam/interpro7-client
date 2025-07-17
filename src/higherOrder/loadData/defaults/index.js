import { createSelector } from 'reselect';
import { format } from 'url';

import descriptionToPath from 'utils/processDescription/descriptionToPath';

import config from 'config';
import { getNeededCountersForSubpages } from './relatedCounters';

const MULTIPLE_SLASHES = /([^:])\/{2,}/g;

const DBS_WITH_SETS = ['pfam', 'cdd', 'pirsf'];

export const cleanUpMultipleSlashes = (str = '') =>
  str.replace(MULTIPLE_SLASHES, '$1/');

export const getUrlForMeta = createSelector(
  (state) => state.settings.api,
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

export const getUrlForRelease = (repoKey) => {
  const selector = createSelector(
    () => config.github[repoKey],
    ({ owner, repo }) =>
      format({
        protocol: 'https',
        hostname: 'api.github.com',
        pathname: `repos/${owner}/${repo}/releases`,
        query: { per_page: 1 },
      }),
  );
  return (state) => selector(state);
};

export const getReadTheDocsURL = (relativePath) =>
  createSelector(
    () => config.github.ReadTheDocs,
    ({ owner, repo, branch = 'master' }) =>
      `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/docs/${relativePath}`,
  );

export const getUrl = createSelector(
  // this one is just to memoize it
  (key) => key,
  (key) =>
    createSelector(
      (state) => state.settings[key],
      (state) => state.settings.navigation.pageSize,
      (state) => state.customLocation.description,
      (state) => state.customLocation.search,
      (state) => state.customLocation.hash,
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
              _search.extra_fields =
                'short_name,description,literature,counters:protein-ida-taxonomy-structure';
              if (DBS_WITH_SETS.includes(description.entry.db))
                _search.extra_fields += '-set';
              break;
            case 'protein':
              _search.extra_fields = 'counters:entry-structure';
              break;
            case 'structure':
              _search.extra_fields = 'counters:entry-protein-taxonomy';
              break;
            case 'taxonomy':
              _search.extra_fields =
                'lineage,counters:entry-protein-structure-proteome';
              break;
            case 'proteome':
              _search.extra_fields = 'counters:entry-protein-structure';
              break;
            case 'set':
              _search.extra_fields = 'counters,description';
              break;
            default:
              _search.extra_fields = undefined;
              break;
          }
        }
        if (hash === 'table') {
          switch (description.main.key) {
            case 'entry':
              _search.extra_fields = 'short_name';
              break;
            case 'taxonomy':
            case 'proteome':
              _search.extra_fields = 'counters:entry-protein';
              break;
            case 'set':
              _search.extra_fields = 'counters:entry,description';
              break;
            default:
              break;
          }
        }
        if (hash === 'tree' && _search.search !== undefined) {
          delete _search.search;
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
  (state) => state.settings.api,
  (state) => state.settings.navigation.pageSize,
  (state) => state.customLocation.description,
  (state) => state.customLocation.search,
  (state) => state.customLocation.hash,
  (
    { protocol, hostname, port, root },
    settingsPageSize,
    description,
    search,
    hash,
  ) => {
    // copy of description, to modify it after
    const newDesc = {};
    const _search = { ...search };
    if (hash === 'tree' && _search.search !== undefined) {
      delete _search.search;
    }
    if (_search.model_page !== undefined) {
      delete _search.model_page;
    }

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
    const newQuery = {
      ..._search,
      extra_fields: undefined,
      page_size: search.page_size || settingsPageSize,
    };
    if (newMain === 'entry') {
      newQuery.extra_fields = 'short_name';
    }
    const counters = getNeededCountersForSubpages(
      description.main.key,
      newMain,
    );
    if (counters) {
      if (newQuery.extra_fields) newQuery.extra_fields += `,${counters}`;
      else newQuery.extra_fields = counters;
    }

    let url = format({
      protocol,
      hostname,
      port,
      pathname: root + descriptionToPath(newDesc),
      query: newQuery,
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
export const includeTaxonFocusedOnURL = (url, focused) => {
  const hasTaxIdRegex = /taxonomy\/uniprot\/\d+/gi;
  if (focused && +focused !== 1 && !url.match(hasTaxIdRegex)) {
    return url.replace(/taxonomy\/uniprot\//, `/taxonomy/uniprot/${focused}/`);
  }
  return url;
};

export const getUrlForApi = (...parameters) =>
  getUrl('api')(...parameters)
    .replace('/entry_alignments', '/')
    .replace('/logo', '/')
    .replace('/alphafold', '/')
    .replace('/bfvd', '/')
    .replace('/domain_architecture', '/')
    .replace('/interactions', '/')
    .replace('/subfamilies', '/')
    .replace('/pathways', '/')
    .replace('/feedback', '/')
    .replace('/sequence', '/')
    .replace('/similar_proteins', '/')
    .replace('/curation', '/')
    // To simplify set calls to use a single endpoint
    .replace(/\/set\/[a-zA-Z0-9]+\/entry\/([a-zA-Z0-9]+)\//, '/set/$1/');
