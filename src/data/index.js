import {loadingData, loadedData, failedLoadingData} from 'actions/creators';
import {cachedFetchJSON} from 'utils/cachedFetch';

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
  return (
    `${api.protocol}//${api.hostname}:${api.port}` +
    `${api.root}${pathname}${searchString}`
  );
};

// Looks at the pathname to see if data needs to be loaded from the API
const shouldLoadData = pathname => (
  /^\/(entry|protein|structure)(\/|$)/i.test(pathname)
);

export default store => async ({pathname, query, search}) => {
  if (!shouldLoadData(pathname)) return;
  console.log(store.getState().settings);
  const dataKey = pathname + search;
  const dataUrl = buildApiUrl(pathname, query, store.getState().settings);
  console.log(`loading data for ${dataUrl}`);
  store.dispatch(loadingData(dataKey));
  try {
    store.dispatch(loadedData(dataKey, await cachedFetchJSON(dataUrl)));
  } catch (err) {
    store.dispatch(failedLoadingData(dataKey, err));
  }
};
