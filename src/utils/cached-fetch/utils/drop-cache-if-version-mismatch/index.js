// @flow

export const VersionHeader = 'InterPro-Version';
export const MinorVersionHeader = 'InterPro-Version-Minor';

export default (headers /*: Headers */) => {
  const versionFromResponse = headers.get(VersionHeader);
  const minorVersionFromResponse = headers.get(MinorVersionHeader);
  const key = 'interpro7-current-data-version';
  const keyMinor = 'interpro7-current-data-version-minor';
  const versionFromCache = sessionStorage.getItem(key);
  const minorVersionFromCache = sessionStorage.getItem(keyMinor);
  let dropEverything = false;
  if (!versionFromResponse) return; // the response doesn't include aversion, so don't drop the cache
  if (!versionFromCache) {
    // first time using the logic of saving the data version
    dropEverything = true;
  } else if (versionFromResponse !== versionFromCache) {
    // Mismatch of versions
    dropEverything = true;
  } else if (
    minorVersionFromResponse &&
    minorVersionFromResponse !== minorVersionFromCache
  ) {
    // Mismatch of minor versions
    dropEverything = true;
  }
  if (dropEverything) {
    window.sessionStorage.clear();
    window.sessionStorage.setItem(key, versionFromResponse);
    if (minorVersionFromResponse) {
      window.sessionStorage.setItem(keyMinor, minorVersionFromResponse);
    }
    return true;
  }
};
