// @flow

export const VersionHeader = 'InterPro-Version';

export default (headers /*: Headers */) => {
  const versionFromResponse = headers.get(VersionHeader);
  const key = 'interpro7-current-data-version';
  const versionFromCache = sessionStorage.getItem(key);
  let dropEverything = false;
  if (!versionFromResponse) return; // the response doesn't include aversion, so don't drop the cache
  if (!versionFromCache) {
    // first time using the logic of saving the data version
    dropEverything = true;
  } else if (versionFromResponse !== versionFromCache) {
    // Mismatch of versions
    dropEverything = true;
  }
  if (dropEverything) {
    window.sessionStorage.clear();
    window.sessionStorage.setItem(key, versionFromResponse);
    return true;
  }
};
