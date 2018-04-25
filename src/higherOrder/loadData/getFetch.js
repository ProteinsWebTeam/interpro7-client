// @flow
import cachedFetch, {
  cachedFetchJSON,
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
  if (method !== 'HEAD') return cachedFetchJSON;
  return cachedFetch;
};
