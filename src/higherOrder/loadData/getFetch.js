// @flow
import cachedFetch, {
  cachedFetchJSON,
  cachedFetchYAML,
  cachedFetchText,
} from 'utils/cached-fetch';

export default (
  {
    method,
    responseType,
  } /*: {
    method: ?string,
    responseType: ?string,
  } */,
) => {
  if (responseType === 'text') return cachedFetchText;
  if (responseType === 'yaml') return cachedFetchYAML;
  if (method !== 'HEAD') return cachedFetchJSON;
  return cachedFetch;
};
