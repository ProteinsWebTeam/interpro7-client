import {loadingData, loadedData, failedLoadingData} from 'actions/creators';
import {cachedFetchJSON} from 'utils/cachedFetch';

// Regular expressions
const STARTING_SLASH = /^\//;
const MULTIPLE_SLAHES = /\/+/g;
const PATHS_REQUIRING_DATA = /^\/?(entry|protein|structure|search)(\/|$)/i;

// Creates a search string from a query object
const queryObjectToSearchString = obj => {
  const partialSearchString = Object.entries(obj)
    .reduce((acc, [k, v]) => `${acc}&${k}=${v}`, '')
    .slice(1);
  return `?${partialSearchString}`;
};

// Creates a URL to query the API
const buildApiUrl = (pathname, query, {pagination, api}) => {
  const searchString = queryObjectToSearchString({
    page_size: pagination.pageSize,
    ...query,
  });
  const cleanPathname = `${pathname}/`
    .replace(STARTING_SLASH, '')
    .replace(MULTIPLE_SLAHES, '/');

  return (
    `${api.protocol}//${api.hostname}:${api.port}` +
    `${api.root}/${cleanPathname}${searchString}`
  );
};

// Creates a URL to query the EBIsearch API
const ebiParameters = {
  format: 'json',
  fields: 'PDB,UNIPROT,description',
};
const buildEBISearchUrl = (pathname, query, {pagination, ebi}) => {
  const mapped = {},
    ebiKeysMap = {
      page: 'start',
      page_size: 'size',
      search: 'query',
    };
  Object.keys(query).forEach(key => {
    mapped[ebiKeysMap[key]] = key === 'page' ?
      (query.page - 1) * query.page_size :
      query[key];
  });
  const searchString = queryObjectToSearchString({
    size: pagination.pageSize,
    ...mapped, ...ebiParameters,
  });
  return (
    `${ebi.protocol}//${ebi.hostname}:${ebi.port}` +
    `${ebi.root}${searchString}`
  );
};

// Looks at the pathname to see if data needs to be loaded from the API
const shouldLoadData = pathname => PATHS_REQUIRING_DATA.test(pathname);

export default store => async ({pathname, query, search}) => {
  if (!shouldLoadData(pathname)) return;

  const dataKey = pathname + search;
  const {settings} = store.getState();
  const dataUrl = (pathname === '/search') ?
    buildEBISearchUrl(pathname, query, settings) :
    buildApiUrl(pathname, query, settings);
  console.log(`loading data for ${dataUrl}`);

  store.dispatch(loadingData(dataKey));
  try {
    store.dispatch(
      loadedData(
        dataKey,
        await cachedFetchJSON(dataUrl, {useCache: settings.cache.enabled})
      )
    );
  } catch (err) {
    store.dispatch(failedLoadingData(dataKey, err));
  }
};
