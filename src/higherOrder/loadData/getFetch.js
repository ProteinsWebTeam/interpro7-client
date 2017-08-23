// @flow
import cachedFetch, {
  cachedFetchJSON,
  cachedFetchText,
} from 'utils/cachedFetch';

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
