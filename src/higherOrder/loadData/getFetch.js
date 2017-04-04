// @flow
import {cachedFetchJSON, cachedFetchText, cachedFetch} from 'utils/cachedFetch';

export default (
  {method, responseType}/*: {
    method: ?string,
    responseType: ?string,
  } */) => {
  if (responseType === 'text') return cachedFetchText;
  if (method !== 'HEAD') return cachedFetchJSON;
  return (...args/*: any */) => cachedFetch(...args).then(r => r.ok);
};
